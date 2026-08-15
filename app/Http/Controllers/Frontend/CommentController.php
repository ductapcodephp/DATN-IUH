<?php

namespace App\Http\Controllers\Frontend;

use App\DTO\Frontend\Comment\ReportCommentData;
use App\Http\Controllers\Controller;
use App\Services\Frontend\CommentService;
use DomainException;
use Exception;
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

    public function report(Request $request, $commentId)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        try {
            $dto = ReportCommentData::fromRequest($request);
            $this->commentService->reportComment($dto, $commentId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Đã gửi báo cáo bình luận thành công',
            ]);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi báo cáo vào lúc này. Vui lòng thử lại sau.',
            ], 500);
        }
    }
}
