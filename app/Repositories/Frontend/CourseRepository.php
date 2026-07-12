<?php

namespace App\Repositories\Frontend;

use App\Models\Course;

class CourseRepository
{
    public function getCourseDetailBySlug($slug)
    {
        return Course::query()
            ->with(['seller:id,name,avatar,current_role', 'chapters.lessons'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();
    }
}
