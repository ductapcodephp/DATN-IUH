<?php

namespace App\Repositories\Frontend\Comments;

interface CommentRepositoryInterface
{
    public function getCommentsForLesson($lessonId);

    public function createComment($userId, $lessonId, $content, $parentId = null);

    public function findById($id);

    public function hasUserReportedComment($reporterId, $commentId): bool;

    public function createReport($reporterId, $commentId, array $data);
}
