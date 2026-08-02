<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Category;

class CategoryApprovedNotification extends Notification
{
    use Queueable;

    public $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'category_approved',
            'title' => 'Danh mục đã được duyệt',
            'message' => 'Yêu cầu tạo danh mục "' . $this->category->name . '" của bạn đã được Admin phê duyệt. Bạn có thể chọn danh mục này cho khóa học của mình.',
            'category_id' => $this->category->id,
            'action_url' => route('seller.courses.index'),
            'icon' => 'fa-check-circle',
            'color' => 'text-success'
        ];
    }
}
