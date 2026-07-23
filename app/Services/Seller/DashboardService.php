<?php

namespace App\Services\Seller;

use App\Repositories\Seller\Dashboard\DashboardRepositoryInterface;
use Carbon\Carbon;

class DashboardService
{
    protected $dashboardRepository;

    public function __construct(DashboardRepositoryInterface $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    public function getDashboardStats(int $sellerId): array
    {
        return [
            'currentMonthRevenue' => $this->dashboardRepository->getCurrentMonthRevenue($sellerId),
            'totalStudents' => $this->dashboardRepository->getTotalStudents($sellerId),
            'newStudentsToday' => $this->dashboardRepository->getNewStudentsToday($sellerId),
            'activeCourses' => $this->dashboardRepository->getActiveCoursesCount($sellerId),
            'avgRating' => round($this->dashboardRepository->getAverageRating($sellerId), 1),
            'totalReviews' => $this->dashboardRepository->getTotalReviews($sellerId),
        ];
    }

    public function getRecentEnrollments(int $sellerId): array
    {
        $enrollments = $this->dashboardRepository->getRecentEnrollments($sellerId, 5);

        return $enrollments->map(function ($enrollment) {
            $order = $this->dashboardRepository->getOrderForEnrollment($enrollment->student_id, $enrollment->course_id);
            $price = $order ? $order->seller_amount : $enrollment->course->price;

            return [
                'student_name' => $enrollment->student->name ?? 'Người dùng Ẩn',
                'course_title' => $enrollment->course->title,
                'price' => $price,
                'time' => $enrollment->created_at->diffForHumans(),
            ];
        })->toArray();
    }

    public function getChartData(int $sellerId, string $filter): array
    {
        $filledChartData = [];

        if ($filter === 'week') {
            $data = $this->dashboardRepository->getDailyStatisticsByDays($sellerId, 7);
            for ($i = 6; $i >= 0; $i--) {
                $dateStr = now()->subDays($i)->format('d/m');
                $existing = $data->firstWhere(fn ($item) => Carbon::parse($item->date)->format('d/m') === $dateStr);
                $filledChartData[] = [
                    'name' => $dateStr,
                    'revenue' => $existing ? (float) $existing->total_revenue : 0,
                    'orders' => $existing ? $existing->total_orders : 0,
                ];
            }
        } elseif ($filter === 'month') {
            $data = $this->dashboardRepository->getDailyStatisticsByDays($sellerId, 30);
            for ($i = 29; $i >= 0; $i--) {
                $dateStr = now()->subDays($i)->format('d/m');
                $existing = $data->firstWhere(fn ($item) => Carbon::parse($item->date)->format('d/m') === $dateStr);
                $filledChartData[] = [
                    'name' => $dateStr,
                    'revenue' => $existing ? (float) $existing->total_revenue : 0,
                    'orders' => $existing ? $existing->total_orders : 0,
                ];
            }
        } elseif ($filter === 'quarter') {
            $data = $this->dashboardRepository->getDailyStatisticsByMonths($sellerId, 3);
            for ($i = 2; $i >= 0; $i--) {
                $monthObj = now()->subMonths($i);
                $nameStr = 'Tháng '.$monthObj->format('m');
                $existing = $data->where('year', $monthObj->year)->where('month', $monthObj->month)->first();
                $filledChartData[] = [
                    'name' => $nameStr,
                    'revenue' => $existing ? (float) $existing->total_revenue : 0,
                    'orders' => $existing ? $existing->total_orders : 0,
                ];
            }
        } elseif ($filter === 'year') {
            $data = $this->dashboardRepository->getDailyStatisticsByMonths($sellerId, 12);
            for ($i = 11; $i >= 0; $i--) {
                $monthObj = now()->subMonths($i);
                $nameStr = 'T'.$monthObj->format('m/y');
                $existing = $data->where('year', $monthObj->year)->where('month', $monthObj->month)->first();
                $filledChartData[] = [
                    'name' => $nameStr,
                    'revenue' => $existing ? (float) $existing->total_revenue : 0,
                    'orders' => $existing ? $existing->total_orders : 0,
                ];
            }
        }

        return $filledChartData;
    }

    public function getWeeklyChartData(int $sellerId): array
    {
        $data = $this->dashboardRepository->getDailyStatisticsByDays($sellerId, 7);
        $weeklyChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateStr = now()->subDays($i)->format('d/m');
            $existing = $data->firstWhere(fn ($item) => Carbon::parse($item->date)->format('d/m') === $dateStr);
            $weeklyChartData[] = [
                'name' => $dateStr,
                'revenue' => $existing ? (float) $existing->total_revenue : 0,
                'orders' => $existing ? $existing->total_orders : 0,
            ];
        }

        return $weeklyChartData;
    }
}
