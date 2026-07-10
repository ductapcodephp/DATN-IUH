<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Students;

use App\DTO\Seller\Student\StudentFilterData;
use App\Models\CourseEnrollment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface StudentRepositoryInterface
{
    public function getStudentsForSellerPaginated(int $sellerId, StudentFilterData $filters): LengthAwarePaginator;

    public function getCoursesBySeller(int $sellerId): Collection;

    public function banStudent(int $sellerId, int $enrollmentId, ?string $reason): CourseEnrollment;

    public function unbanStudent(int $sellerId, int $enrollmentId): CourseEnrollment;
}
