<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;

use App\DTO\Seller\Course\Chapter\ChapterData;
use App\DTO\Seller\Course\Chapter\ReorderChapterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Courses\Chapters\ReorderChapterRequest;
use App\Http\Requests\Seller\Courses\Chapters\StoreChapterRequest;
use App\Http\Requests\Seller\Courses\Chapters\UpdateChapterRequest;
use App\Models\Chapter;
use App\Models\Course;
use App\Services\Seller\Courses\ChapterService;
use Illuminate\Http\RedirectResponse;

class ChapterController extends Controller
{
    public function __construct(
        protected ChapterService $chapterService
    ) {}

    public function store(StoreChapterRequest $request, Course $course): RedirectResponse
    {
        $dto = ChapterData::fromRequest($request);
        $this->chapterService->createChapter($course, $dto);

        return back()->with('success', 'Đã thêm chương mới!');
    }

    public function update(UpdateChapterRequest $request, Course $course, Chapter $chapter): RedirectResponse
    {
        $dto = ChapterData::fromRequest($request);
        $this->chapterService->updateChapter($chapter, $dto);

        return back()->with('success', 'Đã cập nhật tên chương thành công!');
    }

    public function destroy(Course $course, Chapter $chapter): RedirectResponse
    {
        $this->authorizeAccess($course, $chapter);

        $this->chapterService->deleteChapter($chapter);

        return back()->with('success', 'Đã xóa chương thành công!');
    }

    public function reorder(ReorderChapterRequest $request, Course $course): RedirectResponse
    {
        $dto = ReorderChapterData::fromRequest($request);
        $this->chapterService->reorderChapters((int) $course->id, $dto);

        return back()->with('success', 'Đã cập nhật vị trí chương!');
    }

    /**
     * Helper kiểm tra phân quyền riêng cho hành động Destroy (do không có Form Request riêng)
     */
    protected function authorizeAccess(Course $course, Chapter $chapter): void
    {
        $isSellerCourse = (int) $course->seller_id === (int) auth()->id();
        $isChapterInCourse = (int) $chapter->course_id === (int) $course->id;

        if (!$isSellerCourse || !$isChapterInCourse) {
            abort(403, 'Bạn không có quyền thao tác trên chương học này!');
        }
    }
}
