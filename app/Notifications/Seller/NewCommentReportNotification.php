<?php

namespace App\Notifications\Seller;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class NewCommentReportNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $report;

    public function __construct($report)
    {
        $this->report = $report;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $courseId = null;
        if ($this->report->reportable && $this->report->reportable->lesson && $this->report->reportable->lesson->chapter) {
            $courseId = $this->report->reportable->lesson->chapter->course_id;
        }

        return [
            'type' => 'comment_report',
            'title' => 'Bình luận bị báo cáo',
            'message' => 'Một bình luận trong khóa học của bạn vừa bị học viên báo cáo.',
            'url' => $courseId ? route('seller.courses.comments.index', $courseId) : '#',
            'icon' => 'fa-solid fa-flag',
            'color' => 'text-danger',
        ];
    }
}
