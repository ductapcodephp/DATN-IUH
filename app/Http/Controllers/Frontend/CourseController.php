<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category', 'price', 'rating', 'sort']);
        
        $courses = $this->courseService->getAllPublishedCourses($filters, 12);
        $categories = $this->courseService->getActiveCategories();
        $enrolledCourseIds = $this->courseService->getEnrolledCourseIds(auth()->id());

        return Inertia::render('Frontend/Course/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters,
            'enrolledCourseIds' => $enrolledCourseIds,
        ]);
    }

    public function show($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);
        $relatedCourses = $this->courseService->getRelatedCourses($course, 4);
        $isEnrolled = $this->courseService->checkEnrollment(auth()->id(), $course->id);

        return Inertia::render('Frontend/Course/Detail', compact('course', 'relatedCourses', 'isEnrolled'));
    }
}
