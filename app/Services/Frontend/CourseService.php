<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Courses\CourseRepositoryInterface;

class CourseService
{
    protected $courseRepository;

    public function __construct(CourseRepositoryInterface $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getCourseDetailBySlug($slug)
    {
        return $this->courseRepository->getCourseDetailBySlug($slug);
    }

    public function getRelatedCourses($course, $limit = 4)
    {
        return $this->courseRepository->getRelatedCourses($course, $limit);
    }

    public function getPopularCourses($limit = 4)
    {
        return $this->courseRepository->getPopularCourses($limit);
    }

    public function getAllPublishedCourses($filters = [], $perPage = 12)
    {
        return $this->courseRepository->getAllPublishedCourses($filters, $perPage);
    }

    public function getCourseById($id)
    {
        return $this->courseRepository->getCourseById($id);
    }

    public function getActiveCategories()
    {
        return $this->courseRepository->getActiveCategories();
    }

    public function getEnrolledCourseIds($userId)
    {
        if (!$userId) return [];
        return $this->courseRepository->getEnrolledCourseIds($userId);
    }

    public function getEnrollment($userId, $courseId)
    {
        if (!$userId) return null;
        return $this->courseRepository->getEnrollment($userId, $courseId);
    }
    public function getCourseReviews($courseId)
    {
        return $this->courseRepository->getCourseReviews($courseId);
    }

    public function getUserReviewForCourse($userId, $courseId)
    {
        if (!$userId) return null;
        return $this->courseRepository->getUserReviewForCourse($userId, $courseId);
    }

    public function getCompletedOrderForCourse($userId, $courseId)
    {
        if (!$userId) return null;
        return $this->courseRepository->getCompletedOrderForCourse($userId, $courseId);
    }

    public function createReview(array $data)
    {
        return $this->courseRepository->createReview($data);
    }

    public function updateReview($reviewId, array $data)
    {
        return $this->courseRepository->updateReview($reviewId, $data);
    }

    public function deleteReview($reviewId)
    {
        return $this->courseRepository->deleteReview($reviewId);
    }

    public function createFreeOrderAndEnrollment($userId, $course)
    {
        return $this->courseRepository->createFreeOrderAndEnrollment($userId, $course);
    }
}
