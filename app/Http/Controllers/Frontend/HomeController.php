<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CourseEnrollment;
use App\Services\Frontend\HomeService;
use Inertia\Inertia;

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
        $topInstructors = $this->homeService->getTopInstructors();
        $enrolledCourseIds = auth()->check() ? CourseEnrollment::where('student_id', auth()->id())->pluck('course_id')->toArray() : [];

        return Inertia::render('Frontend/Home/Index', compact('vipCourses', 'topInstructors', 'enrolledCourseIds'));
    }
}
