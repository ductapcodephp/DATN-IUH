<?php

namespace App\Repositories\Frontend\Learning;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseProgress;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizResult;

class LearningRepository implements LearningRepositoryInterface
{
    public function getCourseForLearning($slug)
    {
        return Course::query()
            ->with([
                'chapters' => function ($query) {
                    $query->orderBy('sort_order', 'asc');
                },
                'chapters.lessons' => function ($query) {
                    $query->orderBy('sort_order', 'asc');
                },
                'chapters.lessons.video',
                'chapters.lessons.quizzes.questions.answers',
            ])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function getEnrollment($userId, $courseId)
    {
        return CourseEnrollment::where('student_id', $userId)->where('course_id', $courseId)->first();
    }

    public function getUserQuizResults($userId)
    {
        return QuizResult::where('user_id', $userId)->get()->keyBy('quiz_id');
    }

    public function getCompletedLessonIds($userId, $courseId)
    {
        return CourseProgress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();
    }

    public function getLessonProgresses($userId, $courseId)
    {
        return CourseProgress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->get()
            ->keyBy('lesson_id');
    }

    public function getQuizWithAnswers($quizId)
    {
        return Quiz::with('questions.answers')->findOrFail($quizId);
    }

    public function updateOrCreateQuizResult($userId, $quizId, array $data)
    {
        return QuizResult::updateOrCreate(
            ['user_id' => $userId, 'quiz_id' => $quizId],
            $data
        );
    }

    public function getLessonWithChapter($lessonId)
    {
        return Lesson::with('chapter')->find($lessonId);
    }

    public function updateOrCreateCourseProgress($userId, $courseId, $lessonId, array $data)
    {
        $progress = CourseProgress::firstOrNew([
            'user_id' => $userId,
            'course_id' => $courseId,
            'lesson_id' => $lessonId,
        ]);

        if (! $progress->exists) {
            $progress->watched_seconds = 0;
            $progress->skipped_seconds = 0;
            $progress->duration_seconds = 0;
        }

        $progress->fill($data);
        $progress->save();

        return $progress;
    }

    public function countTotalLessons($courseId)
    {
        return Lesson::whereHas('chapter', function ($q) use ($courseId) {
            $q->where('course_id', $courseId);
        })->count();
    }

    public function countCompletedLessons($userId, $courseId)
    {
        return CourseProgress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('is_completed', true)
            ->count();
    }

    public function updateCourseEnrollmentProgress($userId, $courseId, $progressPercentage)
    {
        return CourseEnrollment::where('student_id', $userId)
            ->where('course_id', $courseId)
            ->update(['progress' => $progressPercentage]);
    }
}
