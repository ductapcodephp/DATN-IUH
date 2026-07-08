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

    public function __construct(ChapterRepository $chapterRepository)
    {
        $this->chapterRepository = $chapterRepository;
    }

    public function getCurriculumData(Course $course)
    {
        return $this->chapterRepository->loadCourseCurriculum($course);
    }

   
}
