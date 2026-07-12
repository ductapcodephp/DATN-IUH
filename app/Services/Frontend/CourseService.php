<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\CourseRepository;

class CourseService
{
    protected $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getCourseDetailBySlug($slug)
    {
        return $this->courseRepository->getCourseDetailBySlug($slug);
    }
}
