<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;


use App\DTO\Seller\Course\Lesson\ReorderLessonData;
use App\DTO\Seller\Course\Lesson\StoreLessonData;
use App\DTO\Seller\Course\Lesson\UpdateLessonData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Courses\Lesson\ReorderLessonRequest;
use App\Http\Requests\Seller\Courses\Lesson\StoreLessonRequest;
use App\Http\Requests\Seller\Courses\Lesson\UpdateLessonRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Seller\Courses\LessonService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    public function __construct(
        protected LessonService $lessonService
    ) {}

    public function show(Course $course, Lesson $lesson): Response
    {
        $this->authorizeAccess($course, $lesson);

        $lessonData = $this->lessonService->getLessonDetails((int) $lesson->id);

        return Inertia::render('Seller/Curriculum/Lesson/LessonDetail', [
            'course' => $course,
            'lesson' => $lessonData,
        ]);
    }

    public function store(StoreLessonRequest $request, Course $course, Chapter $chapter): RedirectResponse
    {
        $dto = StoreLessonData::fromRequest($request);
        $this->lessonService->createLesson($course, $chapter, $dto);

        return back()->with('success', 'Đã thêm bài học mới thành công!');
    }

    public function update(UpdateLessonRequest $request, Course $course, Lesson $lesson): RedirectResponse
    {
        $dto = UpdateLessonData::fromRequest($request);
        $this->lessonService->updateLesson($lesson, $dto);

        return back()->with('success', 'Đã cập nhật bài học thành công!');
    }

    public function destroy(Course $course, Lesson $lesson): RedirectResponse
    {
        $this->authorizeAccess($course, $lesson);

        $this->lessonService->deleteLesson($lesson);

        return back()->with('success', 'Đã xóa bài học thành công!');
    }

    public function reorder(ReorderLessonRequest $request, Course $course): RedirectResponse
    {
        $dto = ReorderLessonData::fromRequest($request);
        $this->lessonService->reorderLessons($dto);

        return back()->with('success', 'Đã cập nhật vị trí bài học bằng kéo thả!');
    }

    /**
     * Helper kiểm tra bảo mật cho các phương thức GET/DELETE không qua Form Request (show, destroy)
     */
    protected function authorizeAccess(Course $course, Lesson $lesson): void
    {
        $isSellerCourse = (int) $course->seller_id === (int) auth()->id();
        $isLessonInCourse = (int) $lesson->course_id === (int) $course->id;

        if (!$isSellerCourse || !$isLessonInCourse) {
            abort(403, 'Bạn không có quyền thao tác trên bài học này!');
        }
    }
}
