<?php

namespace App\Services\Finance\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use App\Services\Frontend\CartService;
use App\Models\Coupon;
use Closure;
use Exception;

class ApplyCoupons
{
    public function __construct(protected CartService $cartService) {}

    /**
     * Validate và áp dụng mã giảm giá: lock coupon, kiểm tra tính hợp lệ, tăng used_count.
     */
    public function handle(CheckoutData $data, Closure $next)
    {
        if (empty($data->couponIds)) {
            $data->validCoupons = collect();
            return $next($data);
        }

        $coupons = Coupon::whereIn('id', $data->couponIds)
            ->where('is_active', true)
            ->get();

        $codes = $coupons->pluck('code')->toArray();

        $discountResult = $this->cartService->calculateDiscountForCart($data->cartItems, $codes);
        $data->discountAmount = $discountResult['discountAmount'];

        $validCouponIds = collect($discountResult['validCoupons'])->pluck('id')->toArray();

        if (!empty($validCouponIds)) {
            $data->validCoupons = Coupon::whereIn('id', $validCouponIds)->lockForUpdate()->get();

            foreach ($data->validCoupons as $coupon) {
                if (!$coupon->isValid()) {
                    throw new Exception("Mã {$coupon->code} vừa mới hết lượt sử dụng. Vui lòng chọn lại.");
                }
                $coupon->increment('used_count');
            }
        } else {
            $data->validCoupons = collect();
        }

        return $next($data);
    }
}
