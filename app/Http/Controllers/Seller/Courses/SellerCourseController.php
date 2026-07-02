<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\Seller\Courses\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerCourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index(Request $request)
    {

      $result = $this->courseService->getCoursesIndexData($request->all(), auth()->id());

        return Inertia::render('Seller/Courses/Index', [
            'courses' => $result['paginated'],
            'totalCoursesCount' => $result['total_courses_count'], // Truyền tổng số khóa học sang React
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Seller/Courses/Create', [
            'parentCourses' => $this->courseService->getParentCoursesForCreate(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'status'          => 'required|in:draft,published,hidden',
            'level'           => 'required|in:beginner,intermediate,advanced',
            'is_free'         => 'boolean',
            'is_vip'          => 'boolean',
            'price'           => 'nullable|numeric',
            'original_price'  => 'nullable|numeric',
            'description'     => 'required|string',
            'requirements'    => 'nullable|string',
            'outcomes'        => 'nullable|string',
            'thumbnail'       => 'nullable|image|max:2048',
        ]);

        $this->courseService->createCourse($validated, auth()->id(), $request->file('thumbnail'));

        return redirect()->route('seller.courses.index')->with('success', 'Tạo khóa học thành công!');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Seller/Courses/Edit', [
            'course'        => $course,
            'parentCourses' => $this->courseService->getParentCoursesForEdit($course->id),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'price'          => 'required_if:is_free,false|nullable|numeric',
            'original_price' => 'nullable|numeric',
            'level'          => 'required|in:beginner,intermediate,advanced',
            'status'         => 'required|in:draft,published,hidden',
            'is_free'        => 'boolean',
            'is_vip'         => 'boolean',
            'requirements'   => 'nullable|string',
            'outcomes'       => 'nullable|string',
        ]);

        $this->courseService->updateCourse($course, $validated, $request->boolean('is_free'));

        return redirect()->route('seller.courses.index')->with('success', 'Cập nhật khóa học thành công!');
    }

    public function destroy(Course $course)
    {
        $this->courseService->deleteCourse($course);

        return redirect()->route('seller.courses.index')->with('success', 'Đã xóa khóa học!');
    }
}
