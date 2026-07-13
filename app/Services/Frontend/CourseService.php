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
}
