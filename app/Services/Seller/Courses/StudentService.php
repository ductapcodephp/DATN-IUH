<?php

namespace App\Services\Seller\Courses;

use App\Repositories\Seller\Courses\CourseRepository;
use App\Repositories\Seller\StudentRepository;
use Carbon\Carbon;

class StudentService
{
    protected $studentRepository;
    protected $courseRepository;

    public function __construct(StudentRepository $studentRepository, CourseRepository $courseRepository)
    {
        $this->studentRepository = $studentRepository;
        $this->courseRepository = $courseRepository;
    }

    public function getStudentsIndexData($sellerId, array $filters)
    {
        $perPage = $filters['per_page'] ?? 10;
        $students = $this->studentRepository->getStudentsForSellerPaginated($sellerId, $filters, $perPage);

        $students->getCollection()->transform(function ($s) {
            $s->joined_at = Carbon::parse($s->joined_at)->format('d/m/Y');
            return $s;
        });

        return [
            'students'    => $students,
            'coursesList' => $this->courseRepository->getCoursesBySeller($sellerId),
        ];
    }

    public function blockStudent($sellerId, $studentId, $reason)
    {
        return $this->studentRepository->updateOrCreateBlock($sellerId, $studentId, $reason);
    }
}
