<?php

namespace App\Repositories\Shared;

interface ReviewRepositoryInterface
{
    public function getCourseReviews($courseId);

    public function getPaginatedCourseReviews($courseId, $perPage = 10);

    public function getUserReviewForCourse($userId, $courseId);

    public function createReview(array $data);

    public function updateReview($reviewId, array $data);

    public function deleteReview($reviewId);

    public function getReviewById($reviewId);
}
