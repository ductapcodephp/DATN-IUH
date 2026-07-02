<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Seller\Courses\LessonService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    protected $lessonService;

    // Inject LessonService trực tiếp qua Constructor
    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    /**
     * Hàm kiểm tra quyền sở hữu nội bộ (Hợp nhất bảo mật)
     */
    private function authorizeSeller(Course $course, Lesson $lesson = null)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Mày không có quyền truy cập khóa học này!');
        }
        if ($lesson && $lesson->course_id !== $course->id) {
            abort(404, 'Bài học không tồn tại trong khóa học này!');
        }
    }

    public function show(Course $course, Lesson $lesson)
    {
        $this->authorizeSeller($course, $lesson);

        // Ủy thác Service lấy data bài học kèm video được Eager-load tối ưu
        $lessonData = $this->lessonService->getLessonDetails($lesson->id);

        return Inertia::render('Seller/Curriculum/Lesson/LessonDetail', [
            'course' => $course,
            'lesson' => $lessonData,
        ]);
    }

    public function store(Request $request, Course $course, Chapter $chapter)
    {
        $this->authorizeSeller($course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'required|string|in:video,document,quiz_only',
        ]);

        $this->lessonService->createLesson($course, $chapter, $validated);

        return back()->with('success', 'Đã thêm bài học mới thành công!');
    }

    public function update(Request $request, Course $course, Lesson $lesson)
    {
        $this->authorizeSeller($course, $lesson);

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'nullable|string',
            'is_preview'   => 'sometimes|required|boolean',
            'is_published' => 'sometimes|required|boolean',
        ]);

        $this->lessonService->updateLesson($lesson, $validated);

        return back()->with('success', 'Đã cập nhật bài học thành công!');
    }

    public function destroy(Course $course, Lesson $lesson)
    {
        $this->authorizeSeller($course, $lesson);

        $this->lessonService->deleteLesson($lesson);

        return back()->with('success', 'Đã xóa bài học thành công!');
    }

    public function reorder(Request $request, Course $course)
    {
        $this->authorizeSeller($course);

        $validated = $request->validate([
            'lesson_id'         => 'required|integer',
            'target_chapter_id' => 'required|integer',
            'sorted_ids'        => 'required|array',
            'sorted_ids.*'      => 'required|integer',
        ]);

        $this->lessonService->reorderLessons(
            $validated['lesson_id'],
            $validated['target_chapter_id'],
            $validated['sorted_ids']
        );

        return back()->with('success', 'Đã cập nhật vị trí bài học bằng kéo thả!');
    }
}
