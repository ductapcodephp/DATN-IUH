<?php

namespace App\Console\Commands;

use App\Models\VipSubscription;
use App\Notifications\Seller\VipExpiringNotification;
use Illuminate\Console\Command;

class CheckExpiringVipSubscriptions extends Command
{
    /**
     *
     * @var string
     */
    protected $signature = 'vip:check-expiring';

    /**
     *
     * @var string
     */
    protected $description = 'Kiểm tra và gửi thông báo cho các gói VIP sắp hết hạn trong 3 ngày tới';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $targetDate = now()->addDays(3)->toDateString();

        $expiringSubscriptions = VipSubscription::with(['user', 'vipPackage'])
            ->where('status', 'active')
            ->whereDate('expires_at', $targetDate)
            ->get();

        foreach ($expiringSubscriptions as $subscription) {
            if ($subscription->user) {
                $subscription->user->notify(new VipExpiringNotification(
                    $subscription->vipPackage->name,
                    3
                ));
            }
        }

        $this->info("Đã gửi thông báo cho {$expiringSubscriptions->count()} tài khoản VIP sắp hết hạn.");
    }
}
