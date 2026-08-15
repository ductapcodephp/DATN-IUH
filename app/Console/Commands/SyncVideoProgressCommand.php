<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use App\Models\CourseProgress;
use App\Models\CourseEnrollment;
use App\Models\Lesson;
use Carbon\Carbon;

class SyncVideoProgressCommand extends Command
{
    /**
     *
     * @var string
     */
    protected $signature = 'video-progress:sync';

    /**
     *
     * @var string
     */
    protected $description = 'Đồng bộ tiến độ xem video bị sót trong Redis vào Database';

    /**
     */
    public function handle()
    {
        $keys = $this->scanRedisKeys('laravel_database_video_progress:*');

        if (empty($keys)) {
            $keys = $this->scanRedisKeys('video_progress:*');
        }

        $validEntries = [];

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
            $updatedAt = $progressData['updated_at'] ?? 0;

            if (now()->timestamp - $updatedAt < 60) {
                continue;
            }

            $validEntries[] = [
                'redis_key' => $keySuffix,
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'watched_seconds' => $progressData['watched_seconds'] ?? 0,
                'skipped_seconds' => $progressData['skipped_seconds'] ?? 0,
                'duration_seconds' => $progressData['duration_seconds'] ?? 0,
            ];
        }

        if (empty($validEntries)) {
            $this->info('Không có record nào cần đồng bộ.');
            return;
        }

        $lessonIds = collect($validEntries)->pluck('lesson_id')->unique()->toArray();
        $lessons = Lesson::with('chapter')->whereIn('id', $lessonIds)->get()->keyBy('id');

        $count = 0;

        foreach ($validEntries as $entry) {
            $lesson = $lessons->get($entry['lesson_id']);
            if (!$lesson || !$lesson->chapter) {
                Redis::del($entry['redis_key']);
                continue;
            }

            $courseId = $lesson->chapter->course_id;

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

            if (! $wasCompleted && $progress->is_completed) {
                $totalLessons = Lesson::whereHas('chapter', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                })->count();

                $completedLessons = CourseProgress::where('user_id', $entry['user_id'])
                    ->where('course_id', $courseId)
                    ->where('is_completed', true)
                    ->count();

                $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                CourseEnrollment::where('student_id', $entry['user_id'])
                    ->where('course_id', $courseId)
                    ->update(['progress' => $progressPercentage]);
            }

            // Không xóa Redis key — để TTL tự quản lý, tránh mất lastUpdatedAt
            // cho các request tiếp theo từ frontend.
            $count++;
        }

        $this->info("Đã đồng bộ thành công $count record tiến độ học bị kẹt.");
    }

    private function scanRedisKeys(string $pattern): array
    {
        $keys = [];
        $cursor = '0';

        do {
            $result = Redis::scan($cursor, ['match' => $pattern, 'count' => 100]);

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
