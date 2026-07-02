<?php

namespace App\Services\Seller\Courses;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Repositories\Seller\Courses\ChapterRepository;
use App\Repositories\Seller\Courses\LessonRepository;

class CurriculumService
{
    protected $chapterRepository;
    protected $lessonRepository;

    public function __construct(ChapterRepository $chapterRepository, LessonRepository $lessonRepository)
    {
        $this->chapterRepository = $chapterRepository;
        $this->lessonRepository = $lessonRepository;
    }

    public function getCurriculumData(Course $course)
    {
        return $this->chapterRepository->loadCourseCurriculum($course);
    }

    public function createChapter(Course $course, $title)
    {
        $maxSort = $this->chapterRepository->getMaxSortOrder($course->id);

        return $this->chapterRepository->create([
            'course_id'  => $course->id,
            'title'      => $title,
            'sort_order' => $maxSort + 1,
            'is_published' => true,
        ]);
    }

    public function createLesson(Course $course, Chapter $chapter, array $data)
    {
        if ($chapter->course_id !== $course->id) {
            abort(400, 'Chương này không thuộc khóa học này!');
        }

        $maxSort = $this->lessonRepository->getMaxSortOrder($chapter->id);

        return $this->lessonRepository->create([
            'chapter_id'   => $chapter->id,
            'course_id'    => $course->id,
            'title'        => $data['title'],
            'type'         => $data['type'],
            'sort_order'   => $maxSort + 1,
            'is_published' => false,
            'is_preview'   => false,
        ]);
    }

    public function deleteChapter(Chapter $chapter)
    {
        return $this->chapterRepository->delete($chapter);
    }

    public function deleteLesson(Lesson $lesson)
    {
        return $this->lessonRepository->delete($lesson);
    }

    public function reorderChapters($courseId, array $ids)
    {
        foreach ($ids as $index => $id) {
            $this->chapterRepository->updateSortOrder($id, $courseId, $index + 1);
        }
    }

    public function reorderLessons($lessonId, $targetChapterId, array $sortedIds)
    {
        $this->lessonRepository->updateChapterId($lessonId, $targetChapterId);

        foreach ($sortedIds as $index => $id) {
            $this->lessonRepository->updateSortOrder($id, $index + 1);
        }
    }

    public function updateChapterTitle($courseId, $chapterId, $title)
    {
        $chapter = $this->chapterRepository->findByCourseAndId($courseId, $chapterId);
        return $chapter->update(['title' => $title]);
    }
}
