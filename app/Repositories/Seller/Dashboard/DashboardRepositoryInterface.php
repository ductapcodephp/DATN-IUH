<?php

namespace App\Repositories\Seller\Dashboard;

use Illuminate\Support\Collection;

interface DashboardRepositoryInterface
{
    public function getCurrentMonthRevenue(int $sellerId): float;
    public function getTotalStudents(int $sellerId): int;
    public function getNewStudentsToday(int $sellerId): int;
    public function getActiveCoursesCount(int $sellerId): int;
    public function getAverageRating(int $sellerId): float;
    public function getTotalReviews(int $sellerId): int;
    public function getRecentEnrollments(int $sellerId, int $limit = 5): Collection;
    public function getOrderForEnrollment(int $userId, int $courseId);
    public function getDailyStatisticsByDays(int $sellerId, int $days): Collection;
    public function getDailyStatisticsByMonths(int $sellerId, int $months): Collection;
}
