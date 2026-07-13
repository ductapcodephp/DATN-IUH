<?php

namespace App\Repositories\Frontend\Instructor;

use App\Models\User;

class InstructorRepository implements InstructorRepositoryInterface
{
    public function getAllInstructors($filters = [], $perPage = 12)
    {
        $query = User::query()
            ->sellers()
            ->active()
            ->withCount(['authoredCourses as courses_count' => function ($query) {
                $query->published();
            }]);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('total_students');
                break;
            case 'most_courses':
                $query->orderByDesc('courses_count');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getInstructorDetail($id)
    {
        return User::query()
            ->sellers()
            ->active()
            ->withCount(['authoredCourses as courses_count' => function ($query) {
                $query->published();
            }])
            ->with(['authoredCourses' => function ($query) {
                $query->published()->with('category:id,name')->withAvg('reviews', 'rating');
            }])
            ->findOrFail($id);
    }
}
