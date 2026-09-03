<?php

namespace App\Console\Commands;

use App\Jobs\DistributeVipCouponForUser;
use App\Models\VipSubscription;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

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
    protected $description = 'Tự động phát mã giảm giá hàng tháng cho Học Viên VIP (đẩy vào hàng đợi)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        $activeSubscriptions = VipSubscription::where('status', 'active')
            ->where('expires_at', '>', $now)
            ->whereHas('vipPackage', function ($query) {
                $query->where('role_type', 'user');
            })
            ->pluck('id');

        if ($activeSubscriptions->isEmpty()) {
            $this->info('Không có học viên VIP nào đang hoạt động.');

            return;
        }

        $this->info("Đang đẩy {$activeSubscriptions->count()} job phát mã giảm giá vào hàng đợi...");

        foreach ($activeSubscriptions as $subscriptionId) {
            DistributeVipCouponForUser::dispatch($subscriptionId)
                ->onQueue('vip-coupons');
        }

        $this->info("Đã đẩy {$activeSubscriptions->count()} job vào hàng đợi 'vip-coupons' thành công.");
    }
}
