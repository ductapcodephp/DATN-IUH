<?php

namespace App\Repositories\Frontend\Courses;

use App\Models\Course;
use App\Models\Category;
use App\Models\CourseEnrollment;

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

    public function getActiveCategories()
    {
        return Category::where('is_active', true)->get(['id', 'name', 'slug']);
    }

    public function getEnrolledCourseIds($userId)
    {
        return CourseEnrollment::where('student_id', $userId)->pluck('course_id')->toArray();
    }

    public function getEnrollment($userId, $courseId)
    {
        return CourseEnrollment::where('student_id', $userId)->where('course_id', $courseId)->first();
    }

    public function getCourseReviews($courseId)
    {
        return \App\Models\Review::with('user:id,name,avatar')
            ->where('course_id', $courseId)
            ->where('is_hidden', false) // similar to visible()
            ->latest()
            ->get();
    }

    public function getUserReviewForCourse($userId, $courseId)
    {
        return \App\Models\Review::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function getCompletedOrderForCourse($userId, $courseId)
    {
        return \App\Models\Order::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function createReview(array $data)
    {
        return \App\Models\Review::create($data);
    }

    public function createFreeOrderAndEnrollment($userId, $course)
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($userId, $course) {
            \App\Models\Order::create([
                'user_id' => $userId,
                'course_id' => $course->id,
                'amount_original' => 0,
                'discount_amount' => 0,
                'amount_paid' => 0,
                'commission_rate' => 0,
                'commission_amount' => 0,
                'seller_amount' => 0,
                'status' => 'completed',
                'payment_method' => 'free',
            ]);

            \App\Models\CourseEnrollment::create([
                'course_id' => $course->id,
                'student_id' => $userId,
                'seller_id' => $course->seller_id,
                'progress' => 0,
                'is_banned' => false,
            ]);
        });
    }
}
