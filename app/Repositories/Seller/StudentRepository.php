<?php

namespace App\Repositories\Seller;

use App\Models\SellerStudentBlock;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StudentRepository
{
    public function getStudentsForSellerPaginated($sellerId, array $filters, $perPage)
    {
        return User::query()
            ->join('course_user', 'users.id', '=', 'course_user.user_id')
            ->join('courses', 'course_user.course_id', '=', 'courses.id')
            ->leftJoin('seller_student_blocks', function ($join) use ($sellerId) {
                $join->on('users.id', '=', 'seller_student_blocks.student_id')
                     ->where('seller_student_blocks.seller_id', '=', $sellerId);
            })
            ->where('courses.seller_id', $sellerId)
            ->select([
                'users.id', 'users.name', 'users.email',
                'courses.title as course_name',
                'course_user.created_at as joined_at',
                DB::raw('COALESCE(course_user.progress, 0) as progress'),
                DB::raw('IF(seller_student_blocks.id IS NOT NULL, 1, 0) as is_blocked')
            ])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.name', 'like', "%{$search}%")
                      ->orWhere('users.email', 'like', "%{$search}%");
                });
            })
            ->when($filters['course_id'] ?? null, function ($query, $courseId) {
                if ($courseId !== 'all') {
                    $query->where('courses.id', $courseId);
                }
            })
            ->latest('course_user.created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function updateOrCreateBlock($sellerId, $studentId, $reason)
    {
        return SellerStudentBlock::updateOrCreate(
            ['seller_id' => $sellerId, 'student_id' => $studentId],
            ['reason' => $reason]
        );
    }
}
