<?php

namespace App\Repositories\Admin;

interface AdminDashboardRepositoryInterface
{
    public function getTotalRevenue(): float;
    public function getTotalStudents(): int;
    public function getTotalTeachers(): int;
    public function getPendingReportsCount(): int;
    public function getAverageCompletionRate(): float;
    public function getRevenueChartData(array $filters = []): array;
    public function getExportOrdersData(array $filters = []);
}
