<?php

namespace App\Jobs;

use App\Models\DistributedCoupon;
use App\Models\VipSubscription;
use App\Notifications\VipCouponDistributedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class DistributeVipCouponForUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        protected int $subscriptionId
    ) {}

    public function handle(): void
    {
        $subscription = VipSubscription::with(['vipPackage', 'user'])->find($this->subscriptionId);

        if (! $subscription || ! $subscription->user || ! $subscription->vipPackage) {
            return;
        }

        $user = $subscription->user;
        $vipPackage = $subscription->vipPackage;
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Lấy các coupon template gắn với gói VIP này
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

        $distributedCoupons = [];

        foreach ($coupons as $coupon) {
            // Kiểm tra tháng này đã phát mã cho user + coupon_id này chưa
            $alreadyDistributed = DistributedCoupon::where('user_id', $user->id)
                ->where('coupon_id', $coupon->id)
                ->whereBetween('distributed_at', [$startOfMonth, $endOfMonth])
                ->exists();

            if ($alreadyDistributed) {
                continue;
            }

            // Tạo mã ngẫu nhiên duy nhất
            $code = DistributedCoupon::generateUniqueCode('VIP');

            // Tính hạn sử dụng: cuối tháng hiện tại hoặc hạn của coupon template, lấy cái nào sớm hơn
            $expiresAt = $endOfMonth->copy();
            if ($coupon->expires_at && $coupon->expires_at < $expiresAt) {
                $expiresAt = $coupon->expires_at;
            }

            $distributedCoupon = DistributedCoupon::create([
                'coupon_id' => $coupon->id,
                'user_id' => $user->id,
                'vip_package_id' => $vipPackage->id,
                'vip_subscription_id' => $subscription->id,
                'code' => $code,
                'is_used' => false,
                'expires_at' => $expiresAt,
                'distributed_at' => $now,
            ]);

            $distributedCoupons[] = $distributedCoupon;
        }

        // Gửi email + notification cho user nếu có mã mới
        if (! empty($distributedCoupons)) {
            $user->notify(new VipCouponDistributedNotification($distributedCoupons, $vipPackage));
        }
    }
}
