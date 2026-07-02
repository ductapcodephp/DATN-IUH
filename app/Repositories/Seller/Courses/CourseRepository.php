<?php

namespace App\Repositories\Seller\Courses;

use App\Models\Course;

class CourseRepository
{
    public function getPaginatedCourses($filters, $sellerId, $perPage)
    {
        return Course::query()
            ->where('seller_id', $sellerId)
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllCourses()
    {
        return Course::select('id', 'title')->get();
    }

    public function getParentCoursesExclude($courseId)
    {
        return Course::select('id', 'title')
            ->where('id', '!=', $courseId)
            ->get();
    }

    public function create(array $data)
    {
        return Course::create($data);
    }

    public function update(Course $course, array $data)
    {
        return $course->update($data);
    }

    public function delete(Course $course)
    {
        return $course->delete();
    }

    public function getCoursesBySeller($sellerId)
    {
        return Course::where('seller_id', $sellerId)->get(['id', 'title']);
    }
}
