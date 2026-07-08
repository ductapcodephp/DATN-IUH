<?php

declare(strict_types=1);

namespace App\Services\Seller\Students;

use App\DTO\Seller\Student\BanStudentData;
use App\DTO\Seller\Student\StudentFilterData;
use App\Models\CourseEnrollment;
use App\Repositories\Seller\Students\StudentRepositoryInterface;

class StudentService implements StudentServiceInterface
{
    public function __construct(
        protected StudentRepositoryInterface $studentRepository,
    ) {}

    public function getStudentsIndexData(int $sellerId, StudentFilterData $filters): array
    {
        return [
            'students'    => $this->studentRepository->getStudentsForSellerPaginated($sellerId, $filters),
            'coursesList' => $this->studentRepository->getCoursesBySeller($sellerId),
        ];
    }

    public function banStudent(int $sellerId, int $enrollmentId, BanStudentData $dto): CourseEnrollment
    {
        return $this->studentRepository->banStudent($sellerId, $enrollmentId, $dto->reason);
    }

    public function unbanStudent(int $sellerId, int $enrollmentId): CourseEnrollment
    {
        return $this->studentRepository->unbanStudent($sellerId, $enrollmentId);
    }
}