<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Students;

use App\DTO\Seller\Student\StudentFilterData;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StudentRepository
{
    /**
     * Lấy danh sách học viên đăng ký các khóa học của Seller (có phân trang & lọc)
     */
    public function getStudentsForSellerPaginated(int $sellerId, StudentFilterData $filters): LengthAwarePaginator
    {
        return CourseEnrollment::query()
            ->where('seller_id', $sellerId)
            // Lọc theo khóa học nếu có
            ->when($filters->courseId && $filters->courseId !== 'all', function ($query) use ($filters) {
                $query->where('course_id', (int) $filters->courseId);
            })
            // Lọc theo từ khóa tìm kiếm (tên / email học viên)
            ->when($filters->search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            // Eager loading để tránh lỗi N+1 Query
            ->with([
                'student:id,name,email,avatar',
                'course:id,title'
            ])
            ->latest()
            ->paginate($filters->perPage)
            ->withQueryString();
    }

    /**
     * Lấy danh sách khóa học của Seller phục vụ dropdown lọc ở Frontend
     */
    public function getCoursesBySeller(int $sellerId): Collection
    {
        return Course::query()
            ->where('seller_id', $sellerId)
            ->select('id', 'title')
            ->latest()
            ->get();
    }

    /**
     * Cập nhật trạng thái CẤM học viên vào khóa học
     */
    public function banStudent(int $sellerId, int $enrollmentId, ?string $reason): CourseEnrollment
    {
        $enrollment = CourseEnrollment::where('seller_id', $sellerId)
            ->findOrFail($enrollmentId);

        $enrollment->update([
            'is_banned'  => true,
            'ban_reason' => $reason,
            'banned_at'  => now(),
        ]);

        return $enrollment;
    }

    /**
     * Gỡ bỏ trạng thái cấm (Cho phép học lại bình thường)
     */
    public function unbanStudent(int $sellerId, int $enrollmentId): CourseEnrollment
    {
        $enrollment = CourseEnrollment::where('seller_id', $sellerId)
            ->findOrFail($enrollmentId);

        $enrollment->update([
            'is_banned'  => false,
            'ban_reason' => null,
            'banned_at'  => null,
        ]);

        return $enrollment;
    }
}