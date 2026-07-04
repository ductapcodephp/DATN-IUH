<?php

namespace App\Http\Controllers\Frontend;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Services\Frontend\HomeService;
class HomeController extends Controller
{
    protected $homeService;
    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }
    public function index()
    {
        $vipCourses = $this->homeService->getVipCourses();
        return Inertia::render('Frontend/Home/Index', compact('vipCourses'));
    }
}