<?php

namespace App\Notifications;

use App\Models\DistributedCoupon;
use App\Models\VipPackage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VipCouponDistributedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  DistributedCoupon[]  $distributedCoupons
     */
    protected array $distributedCoupons;

    protected VipPackage $vipPackage;

    public function __construct(array $distributedCoupons, VipPackage $vipPackage)
    {
        $this->distributedCoupons = $distributedCoupons;
        $this->vipPackage = $vipPackage;
        $this->onQueue('notifications');
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject('🎁 Quà tặng VIP tháng này - Mã giảm giá dành riêng cho bạn!')
            ->greeting('Xin chào '.$notifiable->name.'!')
            ->line('Cảm ơn bạn đã là thành viên VIP gói **'.$this->vipPackage->name.'**.')
            ->line('Dưới đây là các mã giảm giá dành riêng cho bạn trong tháng này:');

        foreach ($this->distributedCoupons as $dc) {
            $coupon = $dc->coupon;
            $valueText = $coupon->type === 'percent'
                ? $coupon->value.'%'
                : number_format((float) $coupon->value, 0, ',', '.').' đ';

            $expiresText = $dc->expires_at ? $dc->expires_at->format('d/m/Y') : 'Không giới hạn';

            $mail->line('**Mã: '.$dc->code.'** — Giảm '.$valueText.' (HSD: '.$expiresText.')');
        }

        $mail->line('Hãy nhập mã vào ô "Mã khuyến mãi" khi thanh toán để được áp dụng giảm giá nhé!')
            ->action('Khám phá khóa học ngay', url('/tech-education/courses'))
            ->line('Chúc bạn học tập hiệu quả! 🎓');

        return $mail;
    }

    public function toDatabase($notifiable): array
    {
        $codes = array_map(fn ($dc) => $dc->code, $this->distributedCoupons);
        $codesStr = implode(', ', $codes);

        return [
            'title' => 'Quà tặng VIP tháng này!',
            'message' => 'Bạn vừa nhận được '.count($this->distributedCoupons)." mã giảm giá từ gói VIP {$this->vipPackage->name}: {$codesStr}. Hãy sử dụng ngay khi mua khóa học nhé!",
            'type' => 'vip_coupon',
            'coupon_codes' => $codes,
            'vip_package_name' => $this->vipPackage->name,
            'url' => '/tech-education/courses',
        ];
    }
}
