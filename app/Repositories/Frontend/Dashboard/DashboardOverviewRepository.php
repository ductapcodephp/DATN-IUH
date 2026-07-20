<?php
declare(strict_types=1);
namespace App\Repositories\Frontend\Dashboard;
use App\Models\CourseEnrollment;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DashboardOverviewRepository implements DashboardOverviewRepositoryInterface
{
    public function getDashboardStats(int $userId): array
    {
        $enrollments = CourseEnrollment::where('student_id', $userId)->where('is_banned', false)->get();
        return [
            'total_enrolled'  => $enrollments->count(),
            'completed'       => $enrollments->where('progress', 100)->count(),
            'in_progress'     => $enrollments->where('progress', '<', 100)->where('progress', '>', 0)->count(),
            'not_started'     => $enrollments->where('progress', 0)->count(),
            'wallet_balance'  => ($w = Wallet::where('user_id', $userId)->first()) ? (float) $w->balance : 0.0,
            'total_orders'    => Order::where('user_id', $userId)->where('status', 'completed')->count(),
        ];
    }
    public function getEnrolledCourses(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = CourseEnrollment::with(['course' => fn($q) => $q->with(['seller:id,name,avatar', 'category:id,name'])])
            ->where('student_id', $userId)->where('is_banned', false);
        if (!empty($filters['status'])) {
            match ($filters['status']) {
                'completed'  => $query->where('progress', 100),
                'in_progress' => $query->whereBetween('progress', [1, 99]),
                'not_started' => $query->where('progress', 0),
                default       => null,
            };
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('course', fn($q) => $q->where('title', 'like', "%{$search}%"));
        }
        return $query->orderBy('updated_at', 'desc')->paginate(9);
    }
    public function getCertificates(int $userId): Collection
    {
        return CourseEnrollment::with(['course:id,title,thumbnail,slug'])
            ->where('student_id', $userId)->where('progress', 100)->where('is_banned', false)
            ->orderBy('updated_at', 'desc')->get();
    }
}
