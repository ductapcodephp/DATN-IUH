<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Services\Seller\Courses\CurriculumService;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    protected $curriculumService;

    public function __construct(CurriculumService $curriculumService)
    {
        $this->curriculumService = $curriculumService;
    }

    private function authorizeSeller(Course $course)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Mày không có quyền truy cập khóa học này!');
        }
    }

    public function store(Request $request, Course $course)
    {
        $this->authorizeSeller($course);

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $this->curriculumService->createChapter($course, $request->title);

        return back()->with('success', 'Đã thêm chương mới!');
    }

    public function update(Request $request, Course $course, Chapter $chapter)
    {
        $this->authorizeSeller($course);

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $this->curriculumService->updateChapterTitle($course->id, $chapter->id, $request->input('title'));

        return back()->with('success', 'Đã cập nhật tên chương thành công!');
    }

    public function destroy(Course $course, Chapter $chapter)
    {
        $this->authorizeSeller($course);

        $this->curriculumService->deleteChapter($chapter);

        return back()->with('success', 'Đã xóa chương thành công!');
    }

    public function reorder(Request $request, Course $course)
    {
        $this->authorizeSeller($course);

        $this->curriculumService->reorderChapters($course->id, $request->input('ids'));

        return back()->with('success', 'Đã cập nhật vị trí chương!');
    }
}
