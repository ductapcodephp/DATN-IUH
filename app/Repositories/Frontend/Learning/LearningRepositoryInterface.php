<?php

namespace App\Repositories\Frontend\Learning;

interface LearningRepositoryInterface
{
    public function getCourseForLearning($slug);

    public function getEnrollment($userId, $courseId);

    public function getUserQuizResults($userId);

    public function getCompletedLessonIds($userId, $courseId);

    public function getLessonProgresses($userId, $courseId);

    public function getQuizWithAnswers($quizId);

    public function updateOrCreateQuizResult($userId, $quizId, array $data);

    public function getLessonWithChapter($lessonId);

    public function updateOrCreateCourseProgress($userId, $courseId, $lessonId, array $data);

    public function countTotalLessons($courseId);

    public function countCompletedLessons($userId, $courseId);

    public function updateCourseEnrollmentProgress($userId, $courseId, $progressPercentage);
}
