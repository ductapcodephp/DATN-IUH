<?php

namespace App\Repositories\Frontend\Home;

use App\Models\Course;
use App\Models\User;

class HomeRepository implements HomeRepositoryInterface
{
    public function getSponsoredCourses()
    {
        return Course::query()
            ->select('courses.*', 'course_ads.id as ad_id', 'course_ads.bid_price')
            ->join('course_ads', 'courses.id', '=', 'course_ads.course_id')
            ->with(['seller:id,name,avatar'])
            ->where('course_ads.status', 'active')
            ->whereRaw('course_ads.spent_today < course_ads.daily_budget')
            ->where('courses.status', 'published')
            ->orderByRaw('(RAND() * course_ads.bid_price) DESC')
            ->limit(5)
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
