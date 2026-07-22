<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Comments\CommentRepositoryInterface;

class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepositoryInterface $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function getCommentsForLesson($lessonId)
    {
        return $this->commentRepository->getCommentsForLesson($lessonId);
    }

    public function createComment($userId, $lessonId, $content, $parentId = null)
    {
        return $this->commentRepository->createComment($userId, $lessonId, $content, $parentId);
    }
}
