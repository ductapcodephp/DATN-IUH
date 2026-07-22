<?php

namespace App\Repositories\Frontend\Comments;

use App\Models\Comment;

class CommentRepository implements CommentRepositoryInterface
{
    public function getCommentsForLesson($lessonId)
    {
        return Comment::with('user:id,name,avatar')
            ->where('lesson_id', $lessonId)
            ->visible()
            ->orderBy('created_at', 'desc')
            ->get()
            ->toTree();
    }

    public function createComment($userId, $lessonId, $content, $parentId = null)
    {
        return Comment::create([
            'user_id' => $userId,
            'lesson_id' => $lessonId,
            'content' => $content,
            'parent_id' => $parentId,
            'is_hidden' => false,
        ]);
    }
}
