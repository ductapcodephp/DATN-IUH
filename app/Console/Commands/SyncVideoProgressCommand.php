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
        $keys = Redis::keys('laravel_database_video_progress:*');
        
        if (empty($keys)) {
             $keys = Redis::keys('video_progress:*');
        }

        $count = 0;

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
            $watchedSeconds = $progressData['watched_seconds'] ?? 0;
            $skippedSeconds = $progressData['skipped_seconds'] ?? 0;
            $durationSeconds = $progressData['duration_seconds'] ?? 0;
            $updatedAt = $progressData['updated_at'] ?? 0;

            if (now()->timestamp - $updatedAt < 60) {
                continue;
            }

            $lesson = Lesson::with('chapter')->find($lessonId);
            if (!$lesson || !$lesson->chapter) continue;
            $courseId = $lesson->chapter->course_id;

            $progress = CourseProgress::firstOrCreate(
                [
                    'user_id' => $userId,
                    'course_id' => $courseId,
                    'lesson_id' => $lessonId,
                ],
                [
                    'watched_seconds' => 0,
                    'skipped_seconds' => 0,
                    'duration_seconds' => $durationSeconds,
                    'is_completed' => false,
                ]
            );

            $wasCompleted = $progress->is_completed;

            if ($progress->duration_seconds == 0) {
                $progress->duration_seconds = $durationSeconds;
            }

            $progress->updateWatchedAndSkippedSeconds($watchedSeconds, $skippedSeconds);

            if (! $wasCompleted && $progress->is_completed) {
                $totalLessons = Lesson::whereHas('chapter', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                })->count();

                $completedLessons = CourseProgress::where('user_id', $userId)
                    ->where('course_id', $courseId)
                    ->where('is_completed', true)
                    ->count();

                $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                CourseEnrollment::where('student_id', $userId)
                    ->where('course_id', $courseId)
                    ->update(['progress' => $progressPercentage]);
            }

            Redis::del($keySuffix);
            $count++;
        }

        $this->info("Đã đồng bộ thành công $count record tiến độ học bị kẹt.");
    }
}
