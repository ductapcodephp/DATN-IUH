<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CourseService;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function show($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);
        return Inertia::render('Frontend/Course/Detail', compact('course'));
    }
}
