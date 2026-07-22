<?php

namespace App\Repositories\Shared;

use App\Models\Review;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function getCourseReviews($courseId)
    {
        return Review::with('user:id,name,avatar')
            ->where('course_id', $courseId)
            ->where('is_hidden', false)
            ->latest()
            ->get();
    }

    public function getPaginatedCourseReviews($courseId, $perPage = 10)
    {
        return Review::with('user:id,name,avatar')
            ->where('course_id', $courseId)
            ->latest()
            ->paginate($perPage);
    }

    public function getUserReviewForCourse($userId, $courseId)
    {
        return Review::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function createReview(array $data)
    {
        return Review::create($data);
    }

    public function updateReview($reviewId, array $data)
    {
        $review = Review::find($reviewId);
        if ($review) {
            $review->update($data);
        }
        return $review;
    }

    public function deleteReview($reviewId)
    {
        return Review::destroy($reviewId);
    }

    public function getReviewById($reviewId)
    {
        return Review::with('course')->find($reviewId);
    }
}
