<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Coupon;
use App\Models\VipPackage;

class VipCouponDistributedNotification extends Notification
{
    use Queueable;

    protected $coupon;
    protected $vipPackage;

    public function __construct(Coupon $coupon, VipPackage $vipPackage)
    {
        $this->coupon = $coupon;
        $this->vipPackage = $vipPackage;
    }

    public function via($notifiable): array
    {
        return ['database']; 
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'Quà tặng VIP tháng này!',
            'message' => "Bạn vừa nhận được mã giảm giá {$this->coupon->code} từ gói VIP {$this->vipPackage->name}. Hãy sử dụng ngay khi mua khóa học nhé!",
            'type' => 'vip_coupon',
            'coupon_code' => $this->coupon->code,
            'vip_package_name' => $this->vipPackage->name,
            'url' => '/tech-education/courses',
        ];
    }
}
