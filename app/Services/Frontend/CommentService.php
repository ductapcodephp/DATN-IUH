<?php

namespace App\Services\Frontend;

use App\DTO\Frontend\Comment\ReportCommentData;
use App\Enums\UserRole;
use App\Models\SystemSetting;
use App\Models\User;
use App\Notifications\Admin\NewReportNotification;
use App\Notifications\Seller\NewCommentReportNotification;
use App\Repositories\Frontend\Comments\CommentRepositoryInterface;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

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

    public function reportComment(ReportCommentData $dto, $commentId, $reporterId)
    {
        if ($this->commentRepository->hasUserReportedComment($reporterId, $commentId)) {
            throw new DomainException('Bạn đã gửi báo cáo cho bình luận này rồi. Ban quản trị và giảng viên đang xem xét xử lý.');
        }

        return DB::transaction(function () use ($dto, $commentId, $reporterId) {
            $comment = $this->commentRepository->findById($commentId);

            $report = $this->commentRepository->createReport($reporterId, $comment->id, $dto->toArray());

            // Gửi thông báo đến giảng viên (seller) của bài học đó
            $seller = $comment->lesson?->chapter?->course?->seller;
            if ($seller) {
                $seller->notify(new NewCommentReportNotification($report));
            }

            // Gửi thông báo cho Ban quản trị nếu cài đặt hệ thống cho phép
            if (SystemSetting::where('key', 'notify_new_report')->value('value') == '1') {
                $admins = User::whereIn('current_role', [UserRole::ADMIN, UserRole::ROOT])->get();
                Notification::send($admins, new NewReportNotification($report));
            }

            return $report;
        });
    }
}
