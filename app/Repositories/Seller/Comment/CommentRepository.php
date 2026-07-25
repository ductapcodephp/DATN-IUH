<?php

namespace App\Repositories\Seller\Comment;

use App\Models\Comment;

class CommentRepository implements CommentRepositoryInterface
{
    public function getCommentsByCourseId(int $sellerId, int $courseId, int $perPage = 15)
    {
        return Comment::with(['user:id,name,email,avatar', 'lesson.chapter.course', 'reports'])
            ->whereHas('lesson.chapter.course', function ($q) use ($sellerId, $courseId) {
                $q->where('seller_id', $sellerId)
                  ->where('id', $courseId);
            })
            ->withCount('reports')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findSellerComment(int $sellerId, int $commentId)
    {
        return Comment::whereHas('lesson.chapter.course', function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        })->findOrFail($commentId);
    }

    public function delete(int $id): bool
    {
        return Comment::where('id', $id)->delete() > 0;
    }
}