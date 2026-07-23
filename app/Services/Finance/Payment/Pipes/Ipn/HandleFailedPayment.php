<?php

namespace App\Services\Finance\Payment\Pipes\Ipn;

use App\DTO\Payment\IpnData;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Closure;

class HandleFailedPayment
{
    public function handle(IpnData $data, Closure $next)
    {
        if ($data->isSuccess) {
            return $next($data);
        }

        $payment = $data->payment;

        $payment->update([
            'status' => 'failed',
            'raw_response' => $data->callbackData['raw_response'] ?? $data->callbackData,
        ]);
        $restoredCoupons = [];
        $orderIds = $payment->orders->pluck('id')->toArray();
        $couponUsages = CouponUsage::whereIn('order_id', $orderIds)->get();

        foreach ($couponUsages as $usage) {
            if (! in_array($usage->coupon_id, $restoredCoupons)) {
                Coupon::where('id', $usage->coupon_id)->decrement('used_count');
                $restoredCoupons[] = $usage->coupon_id;
            }
        }

        foreach ($payment->orders as $order) {
            $order->delete();
        }

        return $next($data);
    }
}
