<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CategoryRejectedNotification extends Notification
{
    use Queueable;

    public $categoryName;

    public function __construct(string $categoryName)
    {
        $this->categoryName = $categoryName;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'category_rejected',
            'title' => 'Danh mục bị từ chối',
            'message' => 'Yêu cầu tạo danh mục "' . $this->categoryName . '" của bạn đã bị Admin từ chối.',
            'action_url' => route('seller.courses.index'),
            'icon' => 'fa-times-circle',
            'color' => 'text-danger'
        ];
    }
}
