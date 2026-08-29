<?php

namespace App\Console\Commands;

use App\Models\Coupon;
use App\Models\VipSubscription;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DistributeVipCoupons extends Command
{
    /**
     *
     * @var string
     */
    protected $signature = 'vip:distribute-coupons';

    /**
     *
     * @var string
     */
    protected $description = 'Tự động phát mã giảm giá hàng tháng cho Học Viên VIP';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $activeSubscriptions = VipSubscription::with(['vipPackage', 'user'])
            ->where('status', 'active')
            ->where('expires_at', '>', $now)
            ->whereHas('vipPackage', function ($query) {
                $query->where('role_type', 'user');
            })
            ->get();

        $distributedCount = 0;

        foreach ($activeSubscriptions as $subscription) {
            $user = $subscription->user;
            $vipPackage = $subscription->vipPackage;
            
            if (!$user || !$vipPackage) continue;

            $coupons = $vipPackage->coupons()->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('expires_at')
                        ->orWhere('expires_at', '>=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('max_uses')
                        ->orWhereRaw('used_count < max_uses');
                })
                ->get();

            foreach ($coupons as $coupon) {
                // Kiểm tra xem tháng này user đã nhận thông báo về coupon này chưa
                $alreadyNotifiedThisMonth = $user->notifications()
                    ->where('type', \App\Notifications\VipCouponDistributedNotification::class)
                    ->where('data->coupon_code', $coupon->code)
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->exists();

                if (!$alreadyNotifiedThisMonth) {
                    $user->notify(new \App\Notifications\VipCouponDistributedNotification($coupon, $vipPackage));
                    $distributedCount++;
                }
            }
        }

        $this->info("Đã phát {$distributedCount} mã giảm giá VIP trong tháng này.");
    }
}
