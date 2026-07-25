<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Seller\CommentService;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function index(Request $request, $courseId)
    {
        $comments = $this->commentService->getCourseComments($courseId);
        $course = $this->commentService->getCourseDetails($courseId);

        return Inertia::render('Seller/Comments/Index', [
            'comments' => $comments,
            'course' => $course,
        ]);
    }

    public function destroy($id)
    {
        $this->commentService->deleteComment($id);
        return redirect()->back()->with('success', 'Đã xóa bình luận.');
    }
}
