<?php

namespace App\Repositories\Frontend\Courses;

use App\Models\Course;

class CourseRepository implements CourseRepositoryInterface
{
    public function getCourseDetailBySlug($slug)
    {
        return Course::query()
            ->with(['seller:id,name,avatar,current_role', 'chapters.lessons'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();
    }

    public function getRelatedCourses($course, $limit = 4)
    {
        return Course::query()
            ->with(['seller:id,name,avatar', 'category:id,name'])
            ->withAvg('reviews', 'rating')
            ->withCount('students') // Lượt mua
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->published()
            ->orderByDesc('students_count') // Sắp xếp theo lượt mua từ trên xuống
            ->limit($limit)
            ->get();
    }

    public function getPopularCourses($limit = 4)
    {
        return Course::query()
            ->with(['seller:id,name,avatar', 'category:id,name'])
            ->withAvg('reviews', 'rating')
            ->withCount('students') // Lượt mua
            ->published()
            ->orderByDesc('students_count') // Sắp xếp theo lượt mua từ trên xuống
            ->limit($limit)
            ->get();
    }

    public function getAllPublishedCourses($filters = [], $perPage = 12)
    {
        $query = Course::query()
            ->with(['seller:id,name,avatar', 'category:id,name'])
            ->withAvg('reviews', 'rating')
            ->withCount('students') // if we have students relation
            ->published();
            
        // Filters
        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }
        
        if (!empty($filters['category'])) {
            // Check if $filters['category'] is array
            if (is_array($filters['category'])) {
                $query->whereHas('category', function($q) use ($filters) {
                    $q->whereIn('slug', $filters['category']);
                });
            } else {
                $query->whereHas('category', function($q) use ($filters) {
                    $q->where('slug', $filters['category']);
                });
            }
        }
        
        if (!empty($filters['price'])) {
            if ($filters['price'] === 'free') {
                $query->where('price', 0);
            } elseif ($filters['price'] === 'paid') {
                $query->where('price', '>', 0);
            }
        }
        
        if (!empty($filters['rating'])) {
            $query->having('reviews_avg_rating', '>=', (float)$filters['rating']);
        }
        
        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderByDesc('students_count');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getCourseById($id)
    {
        return Course::find($id);
    }
}
