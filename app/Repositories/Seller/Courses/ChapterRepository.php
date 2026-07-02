<?php

namespace App\Repositories\Seller\Courses;

use App\Models\Chapter;
use App\Models\Course;

class ChapterRepository
{
    public function loadCourseCurriculum(Course $course)
    {
        return $course->load(['chapters' => function ($query) {
            $query->orderBy('sort_order', 'asc')
                ->with(['lessons' => function ($q) {
                    $q->orderBy('sort_order', 'asc')
                        ->with('video'); // 🔥 Thêm dòng này: eager-load video của từng bài học
                }]);
        }]);
    }

    public function getMaxSortOrder($courseId)
    {
        return Chapter::where('course_id', $courseId)->max('sort_order') ?? 0;
    }

    public function create(array $data)
    {
        return Chapter::create($data);
    }

    public function delete(Chapter $chapter)
    {
        return $chapter->delete();
    }

    public function updateSortOrder($id, $courseId, $sortOrder)
    {
        return Chapter::where('id', $id)
            ->where('course_id', $courseId)
            ->update(['sort_order' => $sortOrder]);
    }

    public function findByCourseAndId($courseId, $chapterId)
    {
        return Chapter::where('id', $chapterId)
            ->where('course_id', $courseId)
            ->firstOrFail();
    }
}
