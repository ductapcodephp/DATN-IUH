<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\Chapter\ChapterData;
use App\DTO\Seller\Course\Chapter\ReorderChapterData;
use App\Models\Chapter;
use App\Models\Course;
use App\Repositories\Seller\Courses\ChapterRepository;
use Illuminate\Support\Facades\DB;

class ChapterService
{
    public function __construct(
        protected ChapterRepository $chapterRepository
    ) {}

    public function getCurriculumData(Course $course): Course
    {
        return $this->chapterRepository->loadCourseCurriculum($course);
    }

    public function createChapter(Course $course, ChapterData $dto): Chapter
    {
        $maxSort = $this->chapterRepository->getMaxSortOrder((int) $course->id);

        return $this->chapterRepository->create([
            'course_id'    => $course->id,
            'title'        => $dto->title,
            'sort_order'   => $maxSort + 1,
            'is_published' => $dto->isPublished,
        ]);
    }

    public function updateChapter(Chapter $chapter, ChapterData $dto): bool
    {
        return $this->chapterRepository->update($chapter, [
            'title' => $dto->title,
        ]);
    }

    public function deleteChapter(Chapter $chapter): bool
    {
        return $this->chapterRepository->delete($chapter);
    }

    /**
     * Bọc Transaction cho thao tác sắp xếp để đảm bảo tính toàn vẹn dữ liệu
     */
    public function reorderChapters(int $courseId, ReorderChapterData $dto): void
    {
        DB::transaction(function () use ($courseId, $dto) {
            foreach ($dto->ids as $index => $id) {
                $this->chapterRepository->updateSortOrder($id, $courseId, $index + 1);
            }
        });
    }
}
