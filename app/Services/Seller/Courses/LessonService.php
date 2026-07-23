<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Seller\Course\Lesson\ReorderLessonData;
use App\DTO\Seller\Course\Lesson\StoreLessonData;
use App\DTO\Seller\Course\Lesson\UpdateLessonData;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Repositories\Seller\Courses\LessonRepository;
use Illuminate\Support\Facades\DB;

class LessonService
{
    public function __construct(
        protected LessonRepository $lessonRepository
    ) {}

    public function getLessonDetails(int $lessonId): Lesson
    {
        return $this->lessonRepository->findWithVideoAndQuiz($lessonId);
    }

    public function createLesson(Course $course, Chapter $chapter, StoreLessonData $dto): Lesson
    {
        $maxSort = $this->lessonRepository->getMaxSortOrder((int) $chapter->id);

        return DB::transaction(function () use ($course, $chapter, $dto, $maxSort) {
            $lesson = $this->lessonRepository->create([
                'chapter_id' => $chapter->id,
                'course_id' => $course->id,
                'title' => $dto->title,
                'type' => $dto->type,
                'sort_order' => $maxSort + 1,
                'is_published' => false,
                'is_preview' => false,
            ]);

            if ($lesson->type === 'quiz_only' || $lesson->type === 'quiz') {
                Quiz::create([
                    'lesson_id' => $lesson->id,
                    'title' => 'Bài tập: '.$lesson->title,
                    'trigger_seconds' => 0,
                    'is_required' => false,
                ]);
            }

            return $lesson;
        });
    }

    public function updateLesson(Lesson $lesson, UpdateLessonData $dto): bool
    {
        $data = $dto->toArray();

        if (empty($data)) {
            return false;
        }

        return $this->lessonRepository->update($lesson, $data);
    }

    public function deleteLesson(Lesson $lesson): bool
    {
        return $this->lessonRepository->delete($lesson);
    }

    /**
     * Bọc Transaction bảo vệ logic cập nhật vị trí khi kéo thả bài học
     */
    public function reorderLessons(ReorderLessonData $dto): void
    {
        DB::transaction(function () use ($dto) {
            $this->lessonRepository->updateChapterId($dto->lessonId, $dto->targetChapterId);

            foreach ($dto->sortedIds as $index => $id) {
                $this->lessonRepository->updateSortOrder($id, $index + 1);
            }
        });
    }
}
