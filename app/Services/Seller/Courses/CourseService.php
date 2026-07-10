<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\CourseData;
use App\Models\Course;
use App\Repositories\Seller\Courses\CourseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CourseService
{
    public function __construct(
        protected CourseRepositoryInterface $courseRepository
    ) {}

    public function getCoursesIndexData(array $filters, int $sellerId): array
    {
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 10;
        $paginated = $this->courseRepository->getPaginatedCourses($filters, $sellerId, $perPage);
        $totalCoursesCount = $this->courseRepository->countBySeller($sellerId);

        return [
            'paginated' => $paginated,
            'total_courses_count' => $totalCoursesCount,
        ];
    }

    public function getParentCourses(?int $excludeCourseId = null): Collection
    {
        return $this->courseRepository->getCoursesExclude($excludeCourseId);
    }

    public function createCourse(CourseData $dto, int $sellerId): Course
    {
        $data = $dto->toArray();
        $data['seller_id'] = $sellerId;

        if ($dto->thumbnail) {
            $data['thumbnail'] = $dto->thumbnail->store('courses', 'public');
        }

        return $this->courseRepository->create($data);
    }

    public function updateCourse(Course $course, CourseData $dto): bool
    {
        $data = $dto->toArray();

        if ($dto->thumbnail) {
            $data['thumbnail'] = $dto->thumbnail->store('courses', 'public');
        }

        return $this->courseRepository->update($course, $data);
    }

    public function deleteCourse(Course $course): bool
    {
        return $this->courseRepository->delete($course);
    }
}