<?php

namespace App\Notifications\Seller;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCourseEnrollmentNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $courseName,
        public string $studentName,
        public int $courseId
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'new_course_enrollment',
            'title' => 'Học viên mới',
            'message' => "Học viên {$this->studentName} vừa đăng ký khóa học '{$this->courseName}' của bạn.",
            'course_id' => $this->courseId,
            'icon' => 'fa-solid fa-user-graduate',
            'color' => 'text-success',
        ];
    }
}
