<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Dashboard;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface DashboardOverviewRepositoryInterface
{
    public function getDashboardStats(int $userId): array;

    public function getEnrolledCourses(int $userId, array $filters = []): LengthAwarePaginator;

    public function getCertificates(int $userId): Collection;
}
