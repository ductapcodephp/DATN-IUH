<?php

namespace App\Repositories\Frontend\Home;

use App\Models\Course;
use App\Models\User;

class HomeRepository implements HomeRepositoryInterface
{
    public function getVipCourses()
    {
        return Course::query()
            ->with(['seller:id,name,avatar'])
            ->published()
            ->vip()
            ->inRandomOrder()
            ->limit(4)
            ->get();
    }

    public function getTopInstructors()
    {
        return User::query()
            ->sellers()
            ->withCount('sellerEnrollments as students_count')
            ->withAvg('receivedReviews', 'rating')
            ->whereHas('receivedReviews')
            ->orderByDesc('received_reviews_avg_rating')
            ->limit(4)
            ->get(['users.id', 'users.name', 'users.avatar', 'users.current_role']);
    }
}
