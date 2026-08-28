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

        $activeSubscriptions = VipSubscription::where('status', 'active')
            ->where('expires_at', '>', $now)
            ->whereHas('vipPackage', function ($query) {
                $query->where('role_type', 'user');
            })
            ->get();

        $distributedCount = 0;

        foreach ($activeSubscriptions as $subscription) {
            $existingCoupon = Coupon::where('is_vip_coupon', true)
                ->where('vip_subscription_id', $subscription->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->first();

            if (! $existingCoupon) {
                Coupon::create([
                    'code' => 'VIP_'.$subscription->user_id.'_'.$now->format('Ym').'_'.strtoupper(Str::random(4)),
                    'type' => 'percent',
                    'value' => 10.00,
                    'max_discount_amount' => 50000.00,
                    'max_uses' => 1,
                    'used_count' => 0,
                    'seller_id' => null,
                    'course_id' => null,
                    'starts_at' => $now,
                    'expires_at' => $now->copy()->addDays(30),
                    'is_active' => true,
                    'is_vip_coupon' => true,
                    'vip_subscription_id' => $subscription->id,
                    'user_id_owner' => $subscription->user_id,
                ]);

                $distributedCount++;
            }
        }

        $this->info("Đã phát {$distributedCount} mã giảm giá VIP trong tháng này.");
    }
}
