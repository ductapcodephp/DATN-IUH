<?php

namespace App\Repositories\Admin;

use App\Models\User;
use App\Models\Order;
use App\Models\CourseEnrollment;
use App\Models\VipSubscription;
use App\Models\DailyStatistic;
use App\Models\Course;
use App\DTO\Admin\UserFilterData;
use App\DTO\Admin\CreateUserData;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminUserRepository implements AdminUserRepositoryInterface
{
    public function getPaginatedUsers(UserFilterData $filterData, array $excludedRoles, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::whereNotIn('current_role', $excludedRoles);

        if ($filterData->search) {
            $query->where(function ($q) use ($filterData) {
                $q->where('name', 'like', "%{$filterData->search}%")
                  ->orWhere('email', 'like', "%{$filterData->search}%");
            });
        }

        if ($filterData->status !== null) {
            $query->where('is_active', $filterData->status);
        }

        if ($filterData->role) {
            $query->where('current_role', $filterData->role);
        }

        return $query->orderBy('id', 'desc')->paginate($perPage)->withQueryString();
    }

    public function getDistinctRoles(array $excludedRoles): Collection
    {
        return User::whereNotIn('current_role', $excludedRoles)
            ->select('current_role')
            ->distinct()
            ->pluck('current_role');
    }

    public function findById(int $id): User
    {
        return User::findOrFail($id);
    }

    public function findByIdWithVipPackage(int $id): User
    {
        return User::with(['vipSubscriptions.vipPackage'])->findOrFail($id);
    }

    public function toggleStatus(User $user): bool
    {
        $user->is_active = !$user->is_active;
        return $user->save();
    }

    public function create(CreateUserData $data): User
    {
        return User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'current_role' => $data->current_role,
            'roles' => [$data->current_role],
            'is_active' => true,
        ]);
    }

    public function getUserTotalSpent(int $userId): float
    {
        return (float) Order::where('user_id', $userId)->where('status', 'completed')->sum('amount_paid');
    }

    public function getUserTotalCourses(int $userId): int
    {
        return CourseEnrollment::where('student_id', $userId)->count();
    }

    public function getUserTotalVips(int $userId): int
    {
        return VipSubscription::where('user_id', $userId)->count();
    }

    public function getSellerTotalRevenue(int $sellerId): float
    {
        return (float) DailyStatistic::where('seller_id', $sellerId)->sum('total_revenue');
    }

    public function getSellerTotalCourses(int $sellerId): int
    {
        return Course::where('seller_id', $sellerId)->count();
    }

    public function getSellerTotalStudents(int $sellerId): int
    {
        return CourseEnrollment::where('seller_id', $sellerId)->count();
    }

    public function getUserCompletedOrders(int $userId): Collection
    {
        return Order::with(['course', 'vipPackage'])
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function getStudentRevenues(int $userId, string $groupBy = 'DATE(created_at)', ?Carbon $startDate = null, ?Carbon $endDate = null): Collection
    {
        $query = Order::where('user_id', $userId)->where('status', 'completed');
        
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } elseif ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        $alias = $groupBy === 'MONTH(created_at)' ? 'm' : 'd';
        
        return $query->select(
            DB::raw("{$groupBy} as {$alias}"),
            DB::raw("SUM(amount_paid) as total")
        )->groupBy($alias)->orderBy($alias, 'asc')->get()->keyBy($alias);
    }

    public function getSellerRevenues(int $sellerId, string $groupBy = 'DATE(date)', ?Carbon $startDate = null, ?Carbon $endDate = null): Collection
    {
        $query = DailyStatistic::where('seller_id', $sellerId);
        
        if ($startDate && $endDate) {
            $query->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        } elseif ($startDate) {
            $query->where('date', '>=', $startDate->format('Y-m-d'));
        }

        $alias = $groupBy === 'MONTH(date)' ? 'm' : 'd';

        return $query->select(
            DB::raw("{$groupBy} as {$alias}"),
            DB::raw("SUM(total_revenue) as total")
        )->groupBy($alias)->orderBy($alias, 'asc')->get()->keyBy($alias);
    }

    public function getExportOrdersData(int $userId, array $filters = [])
    {
        $type = $filters['type'] ?? 'week';
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        $query = Order::with(['course', 'vipPackage'])
            ->where('user_id', $userId)
            ->where('status', 'completed');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]);
        } else {
            switch ($type) {
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay());
                    break;
                case 'month':
                    $query->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()]);
                    break;
                case 'year':
                    $query->whereBetween('created_at', [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()]);
                    break;
            }
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
