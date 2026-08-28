<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminDashboardRepositoryInterface;

class DashboardService
{
    protected $repository;

    public function __construct(AdminDashboardRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getStats(array $filters = [])
    {
        return [
            'totalRevenue' => $this->repository->getTotalRevenue(),
            'totalStudents' => $this->repository->getTotalStudents(),
            'totalTeachers' => $this->repository->getTotalTeachers(),
            'pendingReports' => $this->repository->getPendingReportsCount(),
            'completionRate' => $this->repository->getAverageCompletionRate(),
            'revenueChart' => $this->repository->getRevenueChartData($filters),
        ];
    }

    public function getChartData(array $filters = [])
    {
        return $this->repository->getRevenueChartData($filters);
    }

    public function getExportOrdersData(array $filters = [])
    {
        return $this->repository->getExportOrdersData($filters);
    }
}
