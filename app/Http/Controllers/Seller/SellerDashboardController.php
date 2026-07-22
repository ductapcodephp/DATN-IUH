<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\Seller\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerDashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $sellerId = auth()->id();
        $filter = $request->input('filter', 'week');

        $stats = $this->dashboardService->getDashboardStats($sellerId);
        $recentEnrollments = $this->dashboardService->getRecentEnrollments($sellerId);
        $chartData = $this->dashboardService->getChartData($sellerId, $filter);
        $weeklyChartData = $this->dashboardService->getWeeklyChartData($sellerId);

        return Inertia::render('Seller/Dashboard', [
            'stats' => $stats,
            'recentEnrollments' => $recentEnrollments,
            'chartData' => $chartData,
            'weeklyChartData' => $weeklyChartData,
            'currentFilter' => $filter,
        ]);
    }
}
