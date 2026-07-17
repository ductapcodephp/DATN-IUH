<?php

namespace App\Repositories\Frontend\Courses;

interface CourseRepositoryInterface
{
    public function getCourseDetailBySlug($slug);
    public function getRelatedCourses($course, $limit = 4);
    public function getPopularCourses($limit = 4);
    public function getAllPublishedCourses($filters = [], $perPage = 12);
    public function getCourseById($id);
    
    public function getActiveCategories();
    public function getEnrolledCourseIds($userId);
    public function checkEnrollment($userId, $courseId);
}
