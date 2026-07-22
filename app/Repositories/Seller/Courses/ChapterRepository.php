<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Chapter;
use App\Models\Course;

class ChapterRepository
{
    public function loadCourseCurriculum(Course $course): Course
    {
        return $course->load(['chapters' => function ($query) {
            $query->orderBy('sort_order', 'asc')
                ->with(['lessons' => function ($q) {
                    $q->orderBy('sort_order', 'asc')->with('video');
                }]);
        }]);
    }

    public function getMaxSortOrder(int $courseId): int
    {
        return (int) Chapter::query()->where('course_id', $courseId)->max('sort_order');
    }

    public function create(array $data): Chapter
    {
        return Chapter::query()->create($data);
    }

    public function update(Chapter $chapter, array $data): bool
    {
        return $chapter->update($data);
    }

    public function delete(Chapter $chapter): bool
    {
        return $chapter->delete();
    }

    public function updateSortOrder(int $id, int $courseId, int $sortOrder): int
    {
        return Chapter::query()
            ->where('id', $id)
            ->where('course_id', $courseId)
            ->update(['sort_order' => $sortOrder]);
    }
}
