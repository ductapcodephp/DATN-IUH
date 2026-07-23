<?php

namespace App\Notifications\Seller;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VipExpiringNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $packageName,
        public int $daysRemaining
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
            'type' => 'vip_expiring',
            'title' => 'Gói VIP sắp hết hạn',
            'message' => "Gói VIP '{$this->packageName}' của bạn sẽ hết hạn trong {$this->daysRemaining} ngày tới. Vui lòng gia hạn để không bị gián đoạn.",
            'icon' => 'fa-solid fa-crown',
            'color' => 'text-danger',
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
}
