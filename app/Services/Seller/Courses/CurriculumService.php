<?php

namespace App\Services\Seller\Courses;

use App\Models\Course;
use App\Repositories\Seller\Courses\ChapterRepository;

class CurriculumService
{
    protected $chapterRepository;

    public function __construct(ChapterRepository $chapterRepository)
    {
        $this->chapterRepository = $chapterRepository;
    }

    public function getCurriculumData(Course $course)
    {
        return $this->chapterRepository->loadCourseCurriculum($course);
    }
}
