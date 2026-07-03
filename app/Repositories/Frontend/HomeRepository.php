<?php

namespace App\Repositories\Frontend;

use App\Models\Course;

class HomeRepository
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
}