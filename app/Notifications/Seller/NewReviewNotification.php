<?php

namespace App\Notifications\Seller;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $courseName,
        public string $studentName,
        public int $rating,
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

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'new_review',
            'title' => 'Đánh giá mới',
            'message' => "Học viên {$this->studentName} vừa đánh giá {$this->rating} sao cho khóa học '{$this->courseName}'.",
            'course_id' => $this->courseId,
            'icon' => 'fa-solid fa-star',
            'color' => 'text-warning'
        ];
    }
}
