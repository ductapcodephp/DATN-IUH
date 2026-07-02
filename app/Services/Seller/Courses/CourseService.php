<?php

namespace App\Services\Seller\Courses;

use App\Models\Course;
use App\Repositories\Seller\Courses\CourseRepository;
use Illuminate\Support\Str;

class CourseService
{
    protected $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

 public function getCoursesIndexData(array $filters, $sellerId)
    {
        $query = Course::where('seller_id', $sellerId)->withCount('lessons');

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        $perPage = $filters['per_page'] ?? 10;

        $coursesPaginated = $query->latest()->paginate($perPage)->withQueryString();

        $totalCoursesCount = Course::where('seller_id', $sellerId)->count();

        return [
            'paginated' => $coursesPaginated,
            'total_courses_count' => $totalCoursesCount,
        ];
    }

    public function getParentCoursesForCreate()
    {
        return $this->courseRepository->getAllCourses();
    }

    public function getParentCoursesForEdit($courseId)
    {
        return $this->courseRepository->getParentCoursesExclude($courseId);
    }

    public function createCourse(array $data, $sellerId, $thumbnailFile = null)
    {
        if ($thumbnailFile) {
            $data['thumbnail'] = $thumbnailFile->store('courses', 'public');
        }

        $data['requirements'] = explode("\n", $data['requirements'] ?? '');
        $data['outcomes'] = explode("\n", $data['outcomes'] ?? '');
        $data['seller_id'] = $sellerId;
        $data['slug'] = Str::slug($data['title']);

        return $this->courseRepository->create($data);
    }

    public function updateCourse(Course $course, array $data, $isFree)
    {
        $data['requirements'] = explode("\n", str_replace("\r", '', $data['requirements'] ?? ''));
        $data['outcomes'] = explode("\n", str_replace("\r", '', $data['outcomes'] ?? ''));

        if ($isFree) {
            $data['price'] = 0;
            $data['original_price'] = null;
        }

        return $this->courseRepository->update($course, $data);
    }

    public function deleteCourse(Course $course)
    {
        return $this->courseRepository->delete($course);
    }
}
