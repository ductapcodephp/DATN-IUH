<?php

namespace App\Repositories\Frontend\Comments;

interface CommentRepositoryInterface
{
    public function getCommentsForLesson($lessonId);
    public function createComment($userId, $lessonId, $content, $parentId = null);
}
