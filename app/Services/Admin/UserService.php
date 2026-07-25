<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminUserRepositoryInterface;
use App\DTO\Admin\UserFilterData;
use App\DTO\Admin\CreateUserData;
use App\DTO\Admin\UserChartFilterData;
use App\Enums\UserRole;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class UserService
{
    protected $repository;

    public function __construct(AdminUserRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getPaginatedUsers(UserFilterData $filter)
    {
        return $this->repository->getPaginatedUsers($filter, [UserRole::ROOT, UserRole::ADMIN]);
    }

    public function getDistinctRoles()
    {
        return $this->repository->getDistinctRoles([UserRole::ROOT, UserRole::ADMIN]);
    }

    public function toggleStatus(int $id)
    {
        $user = $this->repository->findById($id);
        
        if ($user->current_role === UserRole::ROOT) {
            return ['success' => false, 'message' => 'Không thể khóa tài khoản Root Admin.'];
        }

        $this->repository->toggleStatus($user);

        return ['success' => true, 'message' => 'Đã cập nhật trạng thái người dùng.'];
    }

    public function createUser(CreateUserData $data)
    {
        return $this->repository->create($data);
    }

    public function getUserDetails(int $id)
    {
        $user = $this->repository->findByIdWithVipPackage($id);

        $stats = [];
        if ($user->current_role === UserRole::USER) {
            $stats['total_spent'] = $this->repository->getUserTotalSpent($user->id);
            $stats['total_courses'] = $this->repository->getUserTotalCourses($user->id);
            $stats['total_vips'] = $this->repository->getUserTotalVips($user->id);
        } else {
            $stats['total_revenue'] = $this->repository->getSellerTotalRevenue($user->id);
            $stats['total_courses'] = $this->repository->getSellerTotalCourses($user->id);
            $stats['total_students'] = $this->repository->getSellerTotalStudents($user->id);
        }

        $orders = $this->repository->getUserCompletedOrders($user->id);

        return [
            'user' => $user,
            'stats' => $stats,
            'orders' => $orders,
        ];
    }
    
    public function getUserChartData(int $userId, UserChartFilterData $filterData)
    {
        $user = $this->repository->findById($userId);
        
        $type = $filterData->type;
        $startDate = $filterData->startDate;
        $endDate = $filterData->endDate;

        $isUser = $user->current_role === UserRole::USER;

        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();
            
            if ($isUser) {
                $revenues = $this->repository->getStudentRevenues($user->id, 'DATE(created_at)', $start, $end);
            } else {
                $revenues = $this->repository->getSellerRevenues($user->id, 'DATE(date)', $start, $end);
            }

            $chartData = ['labels' => [], 'data' => []];
            $period = CarbonPeriod::create($startDate, $endDate);
            foreach ($period as $date) {
                $d = $date->format('Y-m-d');
                $chartData['labels'][] = $date->format('d/m');
                $chartData['data'][] = isset($revenues[$d]) ? (float) $revenues[$d]->total : 0;
            }
            return $chartData;
        }

        switch ($type) {
            case 'week':
                $start = Carbon::now()->subDays(6)->startOfDay();
                if ($isUser) {
                    $revenues = $this->repository->getStudentRevenues($user->id, 'DATE(created_at)', $start);
                } else {
                    $revenues = $this->repository->getSellerRevenues($user->id, 'DATE(date)', $start);
                }
                
                $chartData = ['labels' => [], 'data' => []];
                for ($i = 0; $i < 7; $i++) {
                    $date = $start->copy()->addDays($i)->format('Y-m-d');
                    $chartData['labels'][] = Carbon::parse($date)->format('d/m');
                    $chartData['data'][] = isset($revenues[$date]) ? (float) $revenues[$date]->total : 0;
                }
                break;

            case 'month':
                $start = Carbon::now()->startOfMonth();
                $end = Carbon::now()->endOfMonth();
                if ($isUser) {
                    $revenues = $this->repository->getStudentRevenues($user->id, 'DATE(created_at)', $start, $end);
                } else {
                    $revenues = $this->repository->getSellerRevenues($user->id, 'DATE(date)', $start, $end);
                }
                
                $chartData = ['labels' => [], 'data' => []];
                $daysInMonth = Carbon::now()->daysInMonth;
                for ($i = 0; $i < $daysInMonth; $i++) {
                    $date = $start->copy()->addDays($i)->format('Y-m-d');
                    $chartData['labels'][] = Carbon::parse($date)->format('d/m');
                    $chartData['data'][] = isset($revenues[$date]) ? (float) $revenues[$date]->total : 0;
                }
                break;

            case 'year':
                $start = Carbon::now()->startOfYear();
                $end = Carbon::now()->endOfYear();
                if ($isUser) {
                    $revenues = $this->repository->getStudentRevenues($user->id, 'MONTH(created_at)', $start, $end);
                } else {
                    $revenues = $this->repository->getSellerRevenues($user->id, 'MONTH(date)', $start, $end);
                }
                
                $chartData = ['labels' => [], 'data' => []];
                for ($i = 1; $i <= 12; $i++) {
                    $chartData['labels'][] = "Tháng " . $i;
                    $chartData['data'][] = isset($revenues[$i]) ? (float) $revenues[$i]->total : 0;
                }
                break;

            default:
                $chartData = ['labels' => [], 'data' => []];
                break;
        }

        return $chartData;
    }
}
