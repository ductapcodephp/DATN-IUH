<?php

namespace App\Repositories\Frontend\Comments;

use App\Models\Comment;
use App\Models\Report;

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

    public function findById($id)
    {
        return Comment::with(['lesson.chapter.course.seller'])->findOrFail($id);
    }

    public function hasUserReportedComment($reporterId, $commentId): bool
    {
        return Report::where('reporter_id', $reporterId)
            ->where('reportable_type', Comment::class)
            ->where('reportable_id', $commentId)
            ->exists();
    }

    public function createReport($reporterId, $commentId, array $data)
    {
        return Report::create([
            'reporter_id' => $reporterId,
            'reportable_type' => Comment::class,
            'reportable_id' => $commentId,
            'reason' => $data['reason'],
            'details' => $data['details'] ?? null,
            'status' => 'pending',
        ]);
    }
}
