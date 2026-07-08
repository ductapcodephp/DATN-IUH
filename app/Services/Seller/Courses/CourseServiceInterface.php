<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\CourseData;
use App\Models\Course;
use Illuminate\Database\Eloquent\Collection;

interface CourseServiceInterface
{
    public function getCoursesIndexData(array $filters, int $sellerId): array;

    public function getParentCourses(?int $excludeCourseId = null): Collection;

    public function createCourse(CourseData $dto, int $sellerId): Course;

    public function updateCourse(Course $course, CourseData $dto): bool;

    public function deleteCourse(Course $course): bool;
}
