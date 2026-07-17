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
        $topInstructors = $this->homeService->getTopInstructors();
        $enrolledCourseIds = auth()->check() ? \App\Models\CourseEnrollment::where('student_id', auth()->id())->pluck('course_id')->toArray() : [];
        return Inertia::render('Frontend/Home/Index', compact('vipCourses', 'topInstructors', 'enrolledCourseIds'));
    }
}