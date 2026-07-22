<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Lesson;

class LessonRepository
{
    public function findWithVideoAndQuiz(int $id): Lesson
    {
        return Lesson::with(['video', 'quizzes.questions.answers'])->findOrFail($id);
    }

    public function getMaxSortOrder(int $chapterId): int
    {
        return (int) Lesson::query()->where('chapter_id', $chapterId)->max('sort_order');
    }

    public function create(array $data): Lesson
    {
        return Lesson::query()->create($data);
    }

    public function update(Lesson $lesson, array $data): bool
    {
        return $lesson->update($data);
    }

    public function delete(Lesson $lesson): bool
    {
        return $lesson->delete();
    }

    public function updateChapterId(int $lessonId, int $chapterId): int
    {
        return Lesson::query()->where('id', $lessonId)->update([
            'chapter_id' => $chapterId,
        ]);
    }

    public function updateSortOrder(int $lessonId, int $sortOrder): int
    {
        return Lesson::query()->where('id', $lessonId)->update([
            'sort_order' => $sortOrder,
        ]);
    }
}
