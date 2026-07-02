<?php

namespace App\Repositories\Seller\Courses;

use App\Models\Lesson;

class LessonRepository
{
    /**
     * Tìm bài học và Eager Load kèm bảng Video tránh lỗi truy vấn N+1
     */
  public function findWithVideoAndQiz(int $id)
{
    return Lesson::with(['video', 'quizzes.questions.answers'])->findOrFail($id);
}

    /**
     * Lấy giá trị sort_order lớn nhất trong một chương
     */
    public function getMaxSortOrder(int $chapterId): int
    {
        return Lesson::where('chapter_id', $chapterId)->max('sort_order') ?? 0;
    }

    public function create(array $data): Lesson
    {
        return Lesson::create($data);
    }

    public function update(Lesson $lesson, array $data): bool
    {
        return $lesson->update($data);
    }

    public function delete(Lesson $lesson): ?bool
    {
        return $lesson->delete();
    }

    /**
     * Cập nhật nhanh Chương quản lý của bài học
     */
    public function updateChapterId(int $lessonId, int $chapterId): int
    {
        return Lesson::where('id', $lessonId)->update([
            'chapter_id' => $chapterId,
        ]);
    }

    /**
     * Cập nhật nhanh số thứ tự sắp xếp
     */
    public function updateSortOrder(int $lessonId, int $sortOrder): int
    {
        return Lesson::where('id', $lessonId)->update([
            'sort_order' => $sortOrder,
        ]);
    }
}
