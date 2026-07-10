<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CourseRepositoryInterface
{
    public function getPaginatedCourses(array $filters, int $sellerId, int $perPage = 10): LengthAwarePaginator;

    public function countBySeller(int $sellerId): int;

    public function getCoursesExclude(?int $excludeCourseId = null): Collection;

    public function create(array $data): Course;

    public function update(Course $course, array $data): bool;

    public function delete(Course $course): bool;
}
