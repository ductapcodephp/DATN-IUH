<?php

namespace App\Services\Seller;

use App\Repositories\Seller\Comment\CommentRepositoryInterface;
use App\Models\Course; // Assuming Course fetching is simple, or should we use CourseRepository? We'll just use Model here for simplicity or CourseRepository if we want strictness.
use Illuminate\Support\Facades\Auth;

class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepositoryInterface $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function getCourseComments(int $courseId)
    {
        $sellerId = Auth::id();
        return $this->commentRepository->getCommentsByCourseId($sellerId, $courseId);
    }

    public function getCourseDetails(int $courseId)
    {
        $sellerId = Auth::id();
        return Course::where('seller_id', $sellerId)->findOrFail($courseId);
    }

    public function deleteComment(int $commentId)
    {
        $sellerId = Auth::id();
        $comment = $this->commentRepository->findSellerComment($sellerId, $commentId);
        return $this->commentRepository->delete($comment->id);
    }
}