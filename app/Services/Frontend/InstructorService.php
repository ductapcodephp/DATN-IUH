<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Instructor\InstructorRepositoryInterface;

class InstructorService
{
    protected $instructorRepository;

    public function __construct(InstructorRepositoryInterface $instructorRepository)
    {
        $this->instructorRepository = $instructorRepository;
    }

    public function getAllInstructors($filters = [], $perPage = 12)
    {
        return $this->instructorRepository->getAllInstructors($filters, $perPage);
    }

    public function getInstructorDetail($id)
    {
        return $this->instructorRepository->getInstructorDetail($id);
    }
}
