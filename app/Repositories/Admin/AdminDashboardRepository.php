<?php

namespace App\Repositories\Admin;

use App\Models\Order;
use App\Models\User;
use App\Models\Report;
use App\Models\CourseEnrollment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardRepository implements AdminDashboardRepositoryInterface
{
    public function getTotalRevenue(): float
    {
        return (float) Order::where('status', 'completed')->sum('amount_paid');
    }

    public function getTotalStudents(): int
    {
        return User::whereJsonContains('roles', 'user')->count();
    }

    public function getTotalTeachers(): int
    {
        return User::whereJsonContains('roles', 'seller')->count();
    }

    public function getPendingReportsCount(): int
    {
        return Report::where('status', 'pending')->count();
    }

    public function getAverageCompletionRate(): float
    {
        return (float) CourseEnrollment::avg('progress') ?: 0;
    }

    public function getRevenueChartData(array $filters = []): array
    {
        $type = $filters['type'] ?? 'week';
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        $query = Order::where('status', 'completed');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]);
            // Format by day
            $revenues = $query->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount_paid) as total')
            )->groupBy('date')->orderBy('date', 'asc')->get()->keyBy('date');

            $chartData = ['labels' => [], 'data' => []];
            $period = \Carbon\CarbonPeriod::create($startDate, $endDate);
            foreach ($period as $date) {
                $d = $date->format('Y-m-d');
                $chartData['labels'][] = $date->format('d/m');
                $chartData['data'][] = isset($revenues[$d]) ? (float) $revenues[$d]->total : 0;
            }
            return $chartData;
        }

        // Default type filtering
        switch ($type) {
            case 'week':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $query->where('created_at', '>=', $start);
                $revenues = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount_paid) as total'))
                    ->groupBy('date')->orderBy('date', 'asc')->get()->keyBy('date');
                
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
                $query->whereBetween('created_at', [$start, $end]);
                $revenues = $query->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount_paid) as total'))
                    ->groupBy('date')->orderBy('date', 'asc')->get()->keyBy('date');
                
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
                $query->whereBetween('created_at', [$start, $end]);
                $revenues = $query->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(amount_paid) as total'))
                    ->groupBy('month')->orderBy('month', 'asc')->get()->keyBy('month');
                
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
