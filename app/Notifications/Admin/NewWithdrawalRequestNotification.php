<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewWithdrawalRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $withdrawal;

    public function __construct($withdrawal)
    {
        $this->withdrawal = $withdrawal;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'withdrawal',
            'title' => 'Yêu cầu rút tiền mới',
            'message' => 'Giảng viên yêu cầu rút ' . number_format($this->withdrawal->amount, 0, ',', '.') . ' VNĐ',
            'url' => route('admin.withdrawals'),
            'icon' => 'fa-money-bill-wave',
            'color' => 'success',
        ];
    }
}
