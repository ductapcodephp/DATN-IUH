<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\OnlinePayment;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Carbon\Carbon;

class CancelAbandonedPayments extends Command
{
    protected $signature = 'payments:cancel-abandoned';
    protected $description = 'Hủy các giao dịch pending quá 1 phút và hoàn trả mã giảm giá';

    public function handle()
    {
        $expiredPayments = OnlinePayment::with('orders')
            ->where('status', 'pending')
            ->where('created_at', '<', Carbon::now()->subMinutes(15))
            ->get();

        if ($expiredPayments->isEmpty()) {
            $this->info('Không có giao dịch bỏ hoang nào.');
            return;
        }

        $this->info("Tìm thấy {$expiredPayments->count()} giao dịch bỏ hoang.");

        foreach ($expiredPayments as $payment) {
            $restoredCoupons = [];
            $orderIds = $payment->orders->pluck('id')->toArray();
            $couponUsages = CouponUsage::whereIn('order_id', $orderIds)->get();

            foreach ($couponUsages as $usage) {
                if (!in_array($usage->coupon_id, $restoredCoupons)) {
                    Coupon::where('id', $usage->coupon_id)->decrement('used_count');
                    $restoredCoupons[] = $usage->coupon_id;
                    $this->info("  → Hoàn trả mã giảm giá ID: {$usage->coupon_id}");
                }
            }

            foreach ($payment->orders as $order) {
                $order->delete();
            }

            $payment->update([
                'status' => 'failed',
                'raw_response' => ['system_message' => 'Hủy tự động do quá thời gian thanh toán']
            ]);

            $this->info("  ✓ Đã hủy payment ID: {$payment->id} | Mã: {$payment->transaction_code}");
        }

        $this->info('Xong!');
    }
}
