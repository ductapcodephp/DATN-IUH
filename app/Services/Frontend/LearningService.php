<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Learning\LearningRepositoryInterface;
use App\DTO\Frontend\Course\SubmitQuizData;
use App\DTO\Frontend\Course\VideoProgressData;
use Illuminate\Support\Facades\Redis;
use App\Jobs\UpdateVideoProgressJob;
class LearningService
{
    protected $learningRepository;

    public function __construct(LearningRepositoryInterface $learningRepository)
    {
        $this->learningRepository = $learningRepository;
    }

    public function getCourseForLearning($slug)
    {
        return $this->learningRepository->getCourseForLearning($slug);
    }

    public function getLearnPageData($course, $userId)
    {
        $userQuizResults = [];
        $completedLessonIds = [];
        $isEnrolled = false;
        $courseProgress = 0;

        $lessonProgresses = collect();
        if ($userId) {
            $userQuizResults = $this->learningRepository->getUserQuizResults($userId);
            $completedLessonIds = $this->learningRepository->getCompletedLessonIds($userId, $course->id);
            $lessonProgresses = $this->learningRepository->getLessonProgresses($userId, $course->id);
            $enrollment = $this->learningRepository->getEnrollment($userId, $course->id);
            
            $isEnrolled = $enrollment ? true : false;
            $courseProgress = $enrollment ? $enrollment->progress : 0;
        }

        return [
            'userQuizResults' => $userQuizResults,
            'completedLessonIds' => $completedLessonIds,
            'lessonProgresses' => $lessonProgresses,
            'isEnrolled' => $isEnrolled,
            'courseProgress' => $courseProgress,
        ];
    }

    public function submitQuiz(SubmitQuizData $dto, $quizId, $userId)
    {
        $quiz = $this->learningRepository->getQuizWithAnswers($quizId);
        $userAnswers = $dto->answers;
        $correctCount = 0;

        foreach ($quiz->questions as $question) {
            $selected = $userAnswers[$question->id] ?? [];
            if (!is_array($selected)) {
                $selected = [$selected];
            }
            $correctAnswerIds = $question->answers->where('is_correct', true)->pluck('id')->toArray();

            if (count($selected) === count($correctAnswerIds) && empty(array_diff($selected, $correctAnswerIds)) && empty(array_diff($correctAnswerIds, $selected))) {
                $correctCount++;
            }
        }

        $totalQuestions = $quiz->questions->count();
        $isPassed = ($correctCount === $totalQuestions && $totalQuestions > 0);

        $result = $this->learningRepository->updateOrCreateQuizResult($userId, $quiz->id, [
            'score' => 0,
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctCount,
            'user_answers' => $userAnswers,
            'completed_at' => $isPassed ? now() : null,
        ]);

        if ($isPassed) {
            $lesson = $this->learningRepository->getLessonWithChapter($quiz->lesson_id);
            if ($lesson && $lesson->chapter) {
                $courseId = $lesson->chapter->course_id;
                
                $this->learningRepository->updateOrCreateCourseProgress($userId, $courseId, $lesson->id, [
                    'is_completed' => true,
                    'last_watched_at' => now(),
                ]);

                $totalLessons = $this->learningRepository->countTotalLessons($courseId);
                $completedLessons = $this->learningRepository->countCompletedLessons($userId, $courseId);

                $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                $this->learningRepository->updateCourseEnrollmentProgress($userId, $courseId, $progressPercentage);
            }
        }

        return $result;
    }

    public function updateVideoProgress(VideoProgressData $dto, $course, $lessonId, $userId)
    {
        $redisKey = "video_progress:{$userId}:{$lessonId}";
        
        $oldDataJson = Redis::get($redisKey);
        $oldWatched = 0;
        $lastUpdatedAt = null;
        
        if ($oldDataJson) {
            $oldData = json_decode($oldDataJson, true);
            $oldWatched = $oldData['watched_seconds'] ?? 0;
            $lastUpdatedAt = $oldData['updated_at'] ?? null;
        }

        $newWatched = max($oldWatched, $dto->watchedSeconds);
        $currentTimestamp = now()->timestamp;
        
        if ($lastUpdatedAt !== null) {
            // Đã có lịch sử xem
            if ($newWatched > $oldWatched) {
                $videoTimeJump = $newWatched - $oldWatched; 
                
                // MỖI LẦN PING (10s/lần), TIẾN ĐỘ KHÔNG ĐƯỢC NHẢY VỌT QUÁ 25 GIÂY (20s tua hợp lệ + 5s lag)
                // Cho dù hacker có treo máy chờ 5 phút rồi gửi lên, vẫn bị chặn!
                $maxJumpAllowed = 25; 
                
                // Phát hiện gian lận
                if ($videoTimeJump > $maxJumpAllowed) {
                    $newWatched = $oldWatched; 
                }
            }
        } else {
            // Lần đầu tiên gửi tiến độ (chưa có trong Redis)
            // Cấp phép cho lần đầu tua tối đa 20s + 5s lag = 25s
            $maxFirstPingAllowed = 25; 
            if ($newWatched > $maxFirstPingAllowed) {
                $newWatched = 0; // Trả về 0 nếu gian lận ngay lần đầu
            }
        }

        $payload = json_encode([
            'watched_seconds' => $newWatched,
            'skipped_seconds' => $dto->skippedSeconds,
            'duration_seconds' => $dto->durationSeconds,
            'updated_at' => $currentTimestamp
        ]);

        Redis::setex($redisKey, 3600, $payload);

        UpdateVideoProgressJob::dispatch($userId, $lessonId, $course->id)
            ->delay(now()->addSeconds(30));

        return $newWatched;
    }
}
