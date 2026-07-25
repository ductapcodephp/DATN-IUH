<?php

namespace App\Repositories\Admin;

use App\Models\User;
use App\DTO\Admin\UserFilterData;
use App\DTO\Admin\CreateUserData;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Carbon\Carbon;

interface AdminUserRepositoryInterface
{
    public function getPaginatedUsers(UserFilterData $filterData, array $excludedRoles, int $perPage = 15): LengthAwarePaginator;
    public function getDistinctRoles(array $excludedRoles): Collection;
    public function findById(int $id): User;
    public function findByIdWithVipPackage(int $id): User;
    public function toggleStatus(User $user): bool;
    public function create(CreateUserData $data): User;
    
    public function getUserTotalSpent(int $userId): float;
    public function getUserTotalCourses(int $userId): int;
    public function getUserTotalVips(int $userId): int;
    
    public function getSellerTotalRevenue(int $sellerId): float;
    public function getSellerTotalCourses(int $sellerId): int;
    public function getSellerTotalStudents(int $sellerId): int;
    
    public function getUserCompletedOrders(int $userId): Collection;

    public function getStudentRevenues(int $userId, string $groupBy = 'DATE(created_at)', ?Carbon $startDate = null, ?Carbon $endDate = null): Collection;
    public function getSellerRevenues(int $sellerId, string $groupBy = 'DATE(date)', ?Carbon $startDate = null, ?Carbon $endDate = null): Collection;
}
