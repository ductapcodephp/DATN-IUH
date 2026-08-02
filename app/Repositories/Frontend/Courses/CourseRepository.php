<?php

namespace App\Repositories\Frontend\Courses;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Order;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function searchSuggestions($keyword, $limit = 5)
    {
        if (empty($keyword)) {
            return collect();
        }

        $now = Carbon::now();
        $activeVips = DB::table('vip_subscriptions')
            ->join('vip_packages', 'vip_packages.id', '=', 'vip_subscriptions.vip_package_id')
            ->where('vip_subscriptions.status', 'active')
            ->where('vip_subscriptions.expires_at', '>', $now)
            ->where('vip_packages.package_type', 'commission')
            ->select(
                'vip_subscriptions.user_id',
                DB::raw('MAX(vip_packages.priority_level) as vip_priority'),
                DB::raw('MAX(vip_subscriptions.expires_at) as vip_expires_at'),
                DB::raw('MAX(vip_packages.badge_text) as vip_badge_text')
            )
            ->groupBy('vip_subscriptions.user_id');

        return Course::query()
            ->select(
                'courses.id', 'courses.title', 'courses.slug', 'courses.thumbnail', 'courses.seller_id',
                DB::raw('IF(active_vips.user_id IS NOT NULL, 1, 0) as is_vip_seller'),
                'active_vips.vip_badge_text',
                'active_vips.vip_priority',
                'active_vips.vip_expires_at'
            )
            ->leftJoinSub($activeVips, 'active_vips', function ($join) {
                $join->on('courses.seller_id', '=', 'active_vips.user_id');
            })
            ->where('courses.title', 'like', '%'.$keyword.'%')
            ->published()
            ->orderByDesc('active_vips.vip_priority')
            ->orderByDesc('active_vips.vip_expires_at')
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getAllPublishedCourses($filters = [], $perPage = 12)
    {
        $now = Carbon::now();
        $activeVips = DB::table('vip_subscriptions')
            ->join('vip_packages', 'vip_packages.id', '=', 'vip_subscriptions.vip_package_id')
            ->where('vip_subscriptions.status', 'active')
            ->where('vip_subscriptions.expires_at', '>', $now)
            ->where('vip_packages.package_type', 'commission')
            ->select(
                'vip_subscriptions.user_id',
                DB::raw('MAX(vip_packages.priority_level) as vip_priority'),
                DB::raw('MAX(vip_subscriptions.expires_at) as vip_expires_at'),
                DB::raw('MAX(vip_packages.badge_text) as vip_badge_text')
            )
            ->groupBy('vip_subscriptions.user_id');

        $query = Course::query()
            ->select('courses.*', 'active_vips.vip_badge_text', 'active_vips.vip_priority', 'active_vips.vip_expires_at')
            ->selectRaw('IF(active_vips.user_id IS NOT NULL, 1, 0) as is_vip_seller')
            ->leftJoinSub($activeVips, 'active_vips', function ($join) {
                $join->on('courses.seller_id', '=', 'active_vips.user_id');
            })
            ->with(['seller:id,name,avatar', 'category:id,name'])
            ->withAvg('reviews', 'rating')
            ->withCount('students') // if we have students relation
            ->published();

        // Filters
        if (! empty($filters['search'])) {
            $query->where('title', 'like', '%'.$filters['search'].'%');
        }

        if (! empty($filters['category'])) {
            // Check if $filters['category'] is array
            if (is_array($filters['category'])) {
                $query->whereHas('category', function ($q) use ($filters) {
                    $q->whereIn('slug', $filters['category']);
                });
            } else {
                $query->whereHas('category', function ($q) use ($filters) {
                    $q->where('slug', $filters['category']);
                });
            }
        }

        if (! empty($filters['price'])) {
            if ($filters['price'] === 'free') {
                $query->where('price', 0);
            } elseif ($filters['price'] === 'paid') {
                $query->where('price', '>', 0);
            }
        }

        if (! empty($filters['rating'])) {
            $query->having('reviews_avg_rating', '>=', (float) $filters['rating']);
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
                $query->orderByDesc('active_vips.vip_priority')->orderByDesc('active_vips.vip_expires_at')->orderByDesc('students_count');
                break;
            case 'newest':
            default:
                $query->orderByDesc('active_vips.vip_priority')->orderByDesc('active_vips.vip_expires_at')->latest();
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
        return Category::where('is_active', true)
            ->where('type', 'course')
            ->get(['id', 'name', 'slug']);
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
        return Review::with('user:id,name,avatar')
            ->where('course_id', $courseId)
            ->where('is_hidden', false) // similar to visible()
            ->latest()
            ->get();
    }

    public function getUserReviewForCourse($userId, $courseId)
    {
        return Review::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function getCompletedOrderForCourse($userId, $courseId)
    {
        return Order::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
    }

    public function createReview(array $data)
    {
        return Review::create($data);
    }

    public function updateReview($reviewId, array $data)
    {
        $review = Review::find($reviewId);
        if ($review) {
            $review->update($data);
        }

        return $review;
    }

    public function deleteReview($reviewId)
    {
        return Review::destroy($reviewId);
    }

    public function createFreeOrderAndEnrollment($userId, $course)
    {
        DB::transaction(function () use ($userId, $course) {
            Order::create([
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

            CourseEnrollment::create([
                'course_id' => $course->id,
                'student_id' => $userId,
                'seller_id' => $course->seller_id,
                'progress' => 0,
                'is_banned' => false,
            ]);
        });
    }
}
