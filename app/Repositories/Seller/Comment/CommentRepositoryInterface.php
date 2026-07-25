<?php

namespace App\Repositories\Seller\Comment;

interface CommentRepositoryInterface
{
    public function getCommentsByCourseId(int $sellerId, int $courseId, int $perPage = 15);
    public function findSellerComment(int $sellerId, int $commentId);
    public function delete(int $id): bool;
}