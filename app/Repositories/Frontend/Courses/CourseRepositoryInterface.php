<?php

namespace App\Repositories\Frontend\Courses;

interface CourseRepositoryInterface
{
    public function getCourseDetailBySlug($slug);
    public function getRelatedCourses($course, $limit = 4);
    public function getPopularCourses($limit = 4);
    public function getAllPublishedCourses($filters = [], $perPage = 12);
    public function getCourseById($id);
    
    public function getActiveCategories();
    public function getEnrolledCourseIds($userId);
    public function getEnrollment($userId, $courseId);
    
    public function getCourseReviews($courseId);
    public function getUserReviewForCourse($userId, $courseId);
    public function getCompletedOrderForCourse($userId, $courseId);
    public function createReview(array $data);
    public function updateReview($reviewId, array $data);
    public function deleteReview($reviewId);
    public function createFreeOrderAndEnrollment($userId, $course);
}
