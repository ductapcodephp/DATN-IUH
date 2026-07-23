<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Dashboard\DashboardOverviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardOverviewController extends Controller
{
    public function __construct(
        protected DashboardOverviewService $dashboardOverviewService,
    ) {}

    public function index(): Response
    {
        $userId = Auth::id();
        $data = $this->dashboardOverviewService->getDashboardOverview($userId);

        return Inertia::render('Frontend/Dashboard/Index', [
            'stats' => $data['stats'],
            'wallet' => $data['wallet'],
        ]);
    }

    public function myCourses(Request $request): Response
    {
        $userId = Auth::id();
        $filters = $request->only(['status', 'search']);

        $courses = $this->dashboardOverviewService->getEnrolledCourses($userId, $filters);

        return Inertia::render('Frontend/Dashboard/MyCourses', [
            'courses' => $courses,
            'filters' => $filters,
        ]);
    }

    public function certificates(): Response
    {
        $userId = Auth::id();
        $certificates = $this->dashboardOverviewService->getCertificates($userId);

        return Inertia::render('Frontend/Dashboard/Certificates', [
            'certificates' => $certificates,
        ]);
    }
}
