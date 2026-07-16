<?php

namespace App\Repositories\Frontend\Courses;

interface CourseRepositoryInterface
{
    /**
     * Get course detail by slug with relations (seller, chapters, lessons, etc.)
     *
     * @param string $slug
     * @return \App\Models\Course
     */
    public function getCourseDetailBySlug($slug);
    public function getRelatedCourses($course, $limit = 4);
    public function getPopularCourses($limit = 4);
    public function getAllPublishedCourses($filters = [], $perPage = 12);
    public function getCourseById($id);
}
