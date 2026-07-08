<?php

declare(strict_types=1);

namespace App\Services\Seller\Students;

use App\DTO\Seller\Student\BanStudentData;
use App\DTO\Seller\Student\StudentFilterData;
use App\Models\CourseEnrollment;

interface StudentServiceInterface
{
    public function getStudentsIndexData(int $sellerId, StudentFilterData $filters): array;

    public function banStudent(int $sellerId, int $enrollmentId, BanStudentData $dto): CourseEnrollment;

    public function unbanStudent(int $sellerId, int $enrollmentId): CourseEnrollment;
}
