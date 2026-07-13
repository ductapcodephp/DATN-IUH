<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Frontend\CourseService;
use App\Models\Category;
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
        
        $categories = Category::where('is_active', true)->get(['id', 'name', 'slug']);
        
        return Inertia::render('Frontend/Course/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters
        ]);
    }

    public function show($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);
        $relatedCourses = $this->courseService->getRelatedCourses($course, 4);
        
        return Inertia::render('Frontend/Course/Detail', compact('course', 'relatedCourses'));
    }
}
