<?php

namespace App\Jobs;

use App\Models\CourseEnrollment;
use App\Models\CourseProgress;
use App\Models\Lesson;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class UpdateVideoProgressJob implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;

    public $lessonId;

    public $courseId;

    public $uniqueFor = 3600; // Khóa 1 tiếng để tránh lặp job khi worker bị tắt

    public function uniqueId(): string
    {
        return $this->userId.'_'.$this->lessonId;
    }

    public function __construct($userId, $lessonId, $courseId)
    {
        $this->userId = $userId;
        $this->lessonId = $lessonId;
        $this->courseId = $courseId;
    }

    public function handle(): void
    {
        $redisKey = "video_progress:{$this->userId}:{$this->lessonId}";
        $data = Redis::get($redisKey);

        if (! $data) {
            return;
        }

        $progressData = json_decode($data, true);
        $watchedSeconds = $progressData['watched_seconds'] ?? 0;
        $skippedSeconds = $progressData['skipped_seconds'] ?? 0;
        $durationSeconds = $progressData['duration_seconds'] ?? 0;

        $progress = CourseProgress::firstOrCreate(
            [
                'user_id' => $this->userId,
                'course_id' => $this->courseId,
                'lesson_id' => $this->lessonId,
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
            $totalLessons = Lesson::whereHas('chapter', function ($q) {
                $q->where('course_id', $this->courseId);
            })->count();

            $completedLessons = CourseProgress::where('user_id', $this->userId)
                ->where('course_id', $this->courseId)
                ->where('is_completed', true)
                ->count();

            $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

            CourseEnrollment::where('student_id', $this->userId)
                ->where('course_id', $this->courseId)
                ->update(['progress' => $progressPercentage]);
        }
    }
}
