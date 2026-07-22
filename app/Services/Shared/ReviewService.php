<?php

namespace App\Services\Shared;

use App\Repositories\Shared\ReviewRepositoryInterface;

class ReviewService
{
    protected $reviewRepository;

    public function __construct(ReviewRepositoryInterface $reviewRepository)
    {
        $this->reviewRepository = $reviewRepository;
    }

    public function getCourseReviews($courseId)
    {
        return $this->reviewRepository->getCourseReviews($courseId);
    }

    public function getPaginatedCourseReviews($courseId, $perPage = 10)
    {
        return $this->reviewRepository->getPaginatedCourseReviews($courseId, $perPage);
    }

    public function getUserReviewForCourse($userId, $courseId)
    {
        return $this->reviewRepository->getUserReviewForCourse($userId, $courseId);
    }

    public function createReview(array $data)
    {
        return $this->reviewRepository->createReview($data);
    }

    public function updateReview($reviewId, array $data)
    {
        return $this->reviewRepository->updateReview($reviewId, $data);
    }

    public function deleteReview($reviewId)
    {
        return $this->reviewRepository->deleteReview($reviewId);
    }

    public function getReviewById($reviewId)
    {
        return $this->reviewRepository->getReviewById($reviewId);
    }
}
