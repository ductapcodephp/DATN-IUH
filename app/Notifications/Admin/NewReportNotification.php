<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewReportNotification extends Notification implements ShouldQueue
{
    use Queueable;

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
        $typeLabel = '';
        if ($this->report->reportable_type === 'App\Models\Course') {
            $typeLabel = 'khóa học';
        } elseif ($this->report->reportable_type === 'App\Models\Review') {
            $typeLabel = 'đánh giá';
        } else {
            $typeLabel = 'nội dung';
        }

        return [
            'type' => 'report',
            'title' => 'Báo cáo vi phạm mới',
            'message' => 'Một ' . $typeLabel . ' vừa bị báo cáo: ' . $this->report->reason,
            'url' => route('admin.reports'),
            'icon' => 'fa-triangle-exclamation',
            'color' => 'danger',
        ];
    }
}
