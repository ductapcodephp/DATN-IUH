<?php

namespace App\Services\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use App\Models\Order;
use App\Models\CouponUsage;
use Closure;

class CreateOrders
{

    public function handle(CheckoutData $data, Closure $next)
    {
        $ordersToInsert = [];

        foreach ($data->cartItems as $item) {
            $discount = $item->price > 0
                ? ($item->price / $data->totalAmount) * $data->discountAmount
                : 0;

            $amountPaid = $item->price - $discount;

            $commissionRate = $this->resolveCommissionRate($item);
            $commissionAmount = $amountPaid * ($commissionRate / 100);
            $sellerAmount = $amountPaid - $commissionAmount;

            $ordersToInsert[] = [
                'user_id'            => $data->userId,
                'course_id'          => $item->course_id,
                'vip_package_id'     => null,
                'coupon_id'          => null, // Bỏ qua cột này theo yêu cầu
                'online_payment_id'  => $data->onlinePayment->id,
                'amount_original'    => $item->price,
                'discount_amount'    => $discount,
                'amount_paid'        => $amountPaid,
                'commission_rate'    => $commissionRate,
                'commission_amount'  => $commissionAmount,
                'seller_amount'      => $sellerAmount,
                'status'             => 'pending',
                'payment_method'     => $data->gatewayName,
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

        Order::upsert(
            $ordersToInsert,
            ['user_id', 'course_id'],
            [
                'online_payment_id',
                'amount_original',
                'discount_amount',
                'amount_paid',
                'commission_rate',
                'commission_amount',
                'seller_amount',
                'status',
                'payment_method',
                'updated_at',
            ]
        );

        // Lấy danh sách Order vừa insert/update để tạo CouponUsage
        $insertedOrders = Order::with('course')->where('online_payment_id', $data->onlinePayment->id)->get();
        $couponUsagesToInsert = [];

        foreach ($insertedOrders as $order) {
            if ($order->discount_amount > 0) {
                $sellerId = $order->course->seller_id ?? null;
                $matchedCoupons = $this->matchCoupons($data->validCoupons, $order->course_id, $sellerId);
                
                if (count($matchedCoupons) > 0) {
                    $discountPerCoupon = $order->discount_amount / count($matchedCoupons);
                    foreach ($matchedCoupons as $coupon) {
                        $couponUsagesToInsert[] = [
                            'coupon_id'        => $coupon->id,
                            'user_id'          => $data->userId,
                            'order_id'         => $order->id,
                            'discount_applied' => $discountPerCoupon,
                            'created_at'       => now(),
                            'updated_at'       => now(),
                        ];
                    }
                }
            }
        }

        if (!empty($couponUsagesToInsert)) {
            CouponUsage::insert($couponUsagesToInsert);
        }

        return $next($data);
    }

    
    private function resolveCommissionRate($item): float
    {
        $commissionRate = 15;
        $seller = $item->course->seller ?? null;

        if (!$seller) {
            return $commissionRate;
        }

        $activeVip = $seller->vipSubscriptions()
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->with('vipPackage')
            ->first();

        if ($activeVip && $activeVip->vipPackage) {
            $packageName = strtolower($activeVip->vipPackage->name);
            if (str_contains($packageName, 'business')) {
                $commissionRate = 7;
            } elseif (str_contains($packageName, 'pro')) {
                $commissionRate = 10;
            }
        }

        return $commissionRate;
    }

    
    private function matchCoupons($validCoupons, $courseId, $sellerId): array
    {
        $matched = [];
        foreach ($validCoupons as $coupon) {
            if (
                $coupon->course_id == $courseId ||
                $coupon->seller_id == $sellerId ||
                (!$coupon->course_id && !$coupon->seller_id)
            ) {
                $matched[] = $coupon;
            }
        }

        return $matched;
    }
}
