<?php

namespace App\Repositories\Seller\Dashboard;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\DailyStatistic;
use App\Models\Order;
use App\Models\Review;
use App\Models\WalletTransaction;
use Illuminate\Support\Collection;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getCurrentMonthRevenue(int $sellerId): float
    {
        return (float) WalletTransaction::whereHas('wallet', function ($q) use ($sellerId) {
            $q->where('user_id', $sellerId);
        })
            ->where('type', 'in')
            ->where('description', 'like', '%Thu nhập%')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');
    }

    public function getTotalStudents(int $sellerId): int
    {
        return CourseEnrollment::whereHas('course', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->count();
    }

    public function getNewStudentsToday(int $sellerId): int
    {
        return CourseEnrollment::whereHas('course', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->whereDate('created_at', now()->toDateString())->count();
    }

    public function getActiveCoursesCount(int $sellerId): int
    {
        return Course::where('seller_id', $sellerId)->where('status', 'published')->count();
    }

    public function getAverageRating(int $sellerId): float
    {
        return (float) Review::whereHas('course', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->avg('rating');
    }

    public function getTotalReviews(int $sellerId): int
    {
        return Review::whereHas('course', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->count();
    }

    public function getRecentEnrollments(int $sellerId, int $limit = 5): Collection
    {
        return CourseEnrollment::with(['student:id,name', 'course:id,title,price'])
            ->whereHas('course', function ($q) use ($sellerId) {
                $q->where('seller_id', $sellerId);
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function getOrderForEnrollment(int $userId, int $courseId)
    {
        return Order::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', 'completed')
            ->first();
    }

    public function getDailyStatisticsByDays(int $sellerId, int $days): Collection
    {
        return DailyStatistic::where('seller_id', $sellerId)
            ->where('date', '>=', now()->subDays($days - 1)->toDateString())
            ->orderBy('date', 'asc')
            ->get();
    }

    public function getDailyStatisticsByMonths(int $sellerId, int $months): Collection
    {
        return DailyStatistic::where('seller_id', $sellerId)
            ->where('date', '>=', now()->subMonths($months - 1)->startOfMonth()->toDateString())
            ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(total_revenue) as total_revenue, SUM(total_orders) as total_orders')
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
    }
}
