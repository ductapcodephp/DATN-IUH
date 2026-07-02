<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\Seller\Courses\CurriculumService;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    protected $curriculumService;

    public function __construct(CurriculumService $curriculumService)
    {
        $this->curriculumService = $curriculumService;
    }

    private function authorizeSeller(Course $course)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Mày không có quyền truy cập khóa học này!');
        }
    }

    public function index(Course $course)
    {
        $this->authorizeSeller($course);

        $courseWithCurriculum = $this->curriculumService->getCurriculumData($course);

        return Inertia::render('Seller/Curriculum/Index', [
            'course' => $courseWithCurriculum,
            'chapters' => $courseWithCurriculum->chapters,
        ]);
    }
}
