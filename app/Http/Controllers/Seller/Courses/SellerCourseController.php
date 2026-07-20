<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;

use App\DTO\Seller\Course\CourseData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Courses\StoreCourseRequest;
use App\Http\Requests\Seller\Courses\UpdateCourseRequest;
use App\Models\Course;
use App\Services\Seller\Courses\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerCourseController extends Controller
{
    public function __construct(
        protected CourseService $courseService
    ) {}

    public function index(Request $request): Response
    {
        $result = $this->courseService->getCoursesIndexData(
            $request->only(['search', 'status', 'per_page']),
            (int) auth()->id()
        );

        return Inertia::render('Seller/Courses/Index', [
            'courses' => $result['paginated'],
            'totalCoursesCount' => $result['total_courses_count'],
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Seller/Courses/Create', [
            'parentCourses' => $this->courseService->getParentCourses(),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $dto = CourseData::fromRequest($request);
        $this->courseService->createCourse($dto, (int) auth()->id());

        return redirect()->route('seller.courses.index')
            ->with('success', 'Tạo khóa học thành công!');
    }

    public function edit(Course $course): Response
    {
        $this->authorizeAccess($course);

        return Inertia::render('Seller/Courses/Edit', [
            'course'        => $course,
            'parentCourses' => $this->courseService->getParentCourses((int) $course->id),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $dto = CourseData::fromRequest($request);
        $this->courseService->updateCourse($course, $dto);

        return redirect()->route('seller.courses.index')
            ->with('success', 'Cập nhật khóa học thành công!');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $this->authorizeAccess($course);

        $this->courseService->deleteCourse($course);

        return redirect()->route('seller.courses.index')
            ->with('success', 'Đã xóa khóa học!');
    }

    protected function authorizeAccess(Course $course): void
    {
        if ((int) $course->seller_id !== (int) auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác trên khóa học này.');
        }
    }
}
