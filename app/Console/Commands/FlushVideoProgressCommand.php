<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use App\Models\CourseProgress;
use App\Models\CourseEnrollment;
use App\Models\Lesson;

class FlushVideoProgressCommand extends Command
{
    /**
     * @var string
     */
    protected $signature = 'video-progress:flush';

    /**
     * @var string
     */
    protected $description = 'Flush tất cả video progress từ Redis vào Database (batch, mỗi phút)';

    /**
     * Quét tất cả Redis key video_progress:* và ghi batch vào DB.
     * Thay thế hoàn toàn UpdateVideoProgressJob — 0 job dispatch,
     * 1 command/phút xử lý tất cả users.
     */
    public function handle()
    {
        $keys = $this->scanRedisKeys('laravel_database_video_progress:*');

        if (empty($keys)) {
            $keys = $this->scanRedisKeys('video_progress:*');
        }

        $entries = [];

        foreach ($keys as $fullKey) {
            $parts = explode('video_progress:', $fullKey);
            if (count($parts) < 2) continue;

            $keySuffix = 'video_progress:' . $parts[1];
            $ids = explode(':', $parts[1]);

            if (count($ids) != 2) continue;

            $userId = $ids[0];
            $lessonId = $ids[1];

            $data = Redis::get($keySuffix);
            if (! $data) continue;

            $progressData = json_decode($data, true);

            $entries[] = [
                'redis_key' => $keySuffix,
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'watched_seconds' => $progressData['watched_seconds'] ?? 0,
                'skipped_seconds' => $progressData['skipped_seconds'] ?? 0,
                'duration_seconds' => $progressData['duration_seconds'] ?? 0,
                'is_completed' => $progressData['is_completed'] ?? false,
            ];
        }

        if (empty($entries)) {
            return;
        }

        // Preload tất cả lessons + chapters trong 1 query
        $lessonIds = collect($entries)->pluck('lesson_id')->unique()->toArray();
        $lessons = Lesson::with('chapter')->whereIn('id', $lessonIds)->get()->keyBy('id');

        $count = 0;
        $completionUpdates = []; // Gom các course cần recalc progress

        foreach ($entries as $entry) {
            $lesson = $lessons->get($entry['lesson_id']);
            if (!$lesson || !$lesson->chapter) {
                Redis::del($entry['redis_key']);
                continue;
            }

            $courseId = $lesson->chapter->course_id;

            try {
                $progress = CourseProgress::firstOrCreate(
                    [
                        'user_id' => $entry['user_id'],
                        'course_id' => $courseId,
                        'lesson_id' => $entry['lesson_id'],
                    ],
                    [
                        'watched_seconds' => 0,
                        'skipped_seconds' => 0,
                        'duration_seconds' => $entry['duration_seconds'],
                        'is_completed' => false,
                    ]
                );

                $wasCompleted = $progress->is_completed;

                if ($progress->duration_seconds == 0) {
                    $progress->duration_seconds = $entry['duration_seconds'];
                }

                $progress->updateWatchedAndSkippedSeconds($entry['watched_seconds'], $entry['skipped_seconds']);

                // Nếu vừa hoàn thành → đánh dấu cần recalc course progress
                if (! $wasCompleted && $progress->is_completed) {
                    $completionUpdates["{$entry['user_id']}:{$courseId}"] = [
                        'user_id' => $entry['user_id'],
                        'course_id' => $courseId,
                    ];
                }

                // Đồng bộ is_completed ngược lại Redis
                if ($progress->is_completed && !$entry['is_completed']) {
                    $redisData = Redis::get($entry['redis_key']);
                    if ($redisData) {
                        $decoded = json_decode($redisData, true);
                        $decoded['is_completed'] = true;
                        Redis::setex($entry['redis_key'], 3600, json_encode($decoded));
                    }
                }

                $count++;
            } catch (\Throwable $e) {
                Log::error('FlushVideoProgress: Error processing entry', [
                    'user_id' => $entry['user_id'],
                    'lesson_id' => $entry['lesson_id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Batch recalculate course progress cho các lesson vừa hoàn thành
        foreach ($completionUpdates as $update) {
            try {
                $totalLessons = Lesson::whereHas('chapter', function ($q) use ($update) {
                    $q->where('course_id', $update['course_id']);
                })->count();

                $completedLessons = CourseProgress::where('user_id', $update['user_id'])
                    ->where('course_id', $update['course_id'])
                    ->where('is_completed', true)
                    ->count();

                $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                CourseEnrollment::where('student_id', $update['user_id'])
                    ->where('course_id', $update['course_id'])
                    ->update(['progress' => $progressPercentage]);
            } catch (\Throwable $e) {
                Log::error('FlushVideoProgress: Error recalculating course progress', [
                    'user_id' => $update['user_id'],
                    'course_id' => $update['course_id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($count > 0) {
            $this->info("Đã flush {$count} progress entries vào DB." . 
                (count($completionUpdates) > 0 ? " ({$this->countCompletions($completionUpdates)} lessons hoàn thành mới)" : ''));
        }
    }

    private function countCompletions(array $updates): int
    {
        return count($updates);
    }

    private function scanRedisKeys(string $pattern): array
    {
        $keys = [];
        $cursor = '0';

        do {
            $result = Redis::scan($cursor, ['match' => $pattern, 'count' => 200]);

            if ($result === false) {
                break;
            }

            [$cursor, $matches] = $result;

            if (is_array($matches) && !empty($matches)) {
                $keys = array_merge($keys, $matches);
            }
        } while ($cursor !== '0' && $cursor !== 0);

        return $keys;
    }
}
