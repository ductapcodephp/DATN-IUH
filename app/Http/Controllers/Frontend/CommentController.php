<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function getComments($slug, $lessonId)
    {
        $comments = $this->commentService->getCommentsForLesson($lessonId);

        return response()->json([
            'success' => true,
            'comments' => $comments,
        ]);
    }

    public function addComment(Request $request, $slug, $lessonId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $this->commentService->createComment(
            auth()->id(),
            $lessonId,
            $request->input('content'),
            $request->input('parent_id')
        );
        
        $comment->load('user:id,name,avatar');

        return response()->json([
            'success' => true,
            'comment' => $comment,
            'message' => 'Đã gửi bình luận thành công',
        ]);
    }
}
