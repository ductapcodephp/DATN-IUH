<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseRepository implements CourseRepositoryInterface
{
    public function getPaginatedCourses(array $filters, int $sellerId, int $perPage = 10): LengthAwarePaginator
    {
        return Course::query()
            ->where('seller_id', $sellerId)
            ->withCount('lessons')
            ->when(!empty($filters['search']), function ($query) use ($filters) {
                $query->where('title', 'like', "%{$filters['search']}%");
            })
            ->when(!empty($filters['status']) && $filters['status'] !== 'all', function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function countBySeller(int $sellerId): int
    {
        return Course::query()->where('seller_id', $sellerId)->count();
    }

    public function getCoursesExclude(?int $excludeCourseId = null): Collection
    {
        return Course::query()
            ->select('id', 'title')
            ->when($excludeCourseId, fn ($query) => $query->where('id', '!=', $excludeCourseId))
            ->get();
    }

    public function create(array $data): Course
    {
        return Course::query()->create($data);
    }

    public function update(Course $course, array $data): bool
    {
        return $course->update($data);
    }

    public function delete(Course $course): bool
    {
        return $course->delete();
    }
}
