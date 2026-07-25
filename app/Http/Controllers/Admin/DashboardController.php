<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $service;

    public function __construct(DashboardService $service)
    {
        $this->service = $service;
    }

    public function index(\Illuminate\Http\Request $request)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        $stats = $this->service->getStats($filters);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    public function getChartData(\Illuminate\Http\Request $request)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        return response()->json($this->service->getChartData($filters));
    }
}
