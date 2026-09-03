<?php

namespace App\Services\Finance\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use App\Models\Coupon;
use App\Models\DistributedCoupon;
use App\Services\Frontend\CartService;
use Closure;
use Exception;

class ApplyCoupons
{
    public function __construct(protected CartService $cartService) {}

    /**
     * Validate và áp dụng mã giảm giá: lock coupon, kiểm tra tính hợp lệ, tăng used_count.
     * Hỗ trợ cả mã thường (coupon) và mã VIP distributed.
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

        // Thêm mã VIP distributed từ session nếu có
        $appliedCodes = session('applied_coupons', []);
        $vipCodes = array_filter($appliedCodes, fn ($code) => str_starts_with(strtoupper($code), 'VIP-'));
        $codes = array_merge($codes, $vipCodes);

        if (empty($codes)) {
            $data->validCoupons = collect();

            return $next($data);
        }

        $discountResult = $this->cartService->calculateDiscountForCart($data->cartItems, $codes);
        $data->discountAmount = $discountResult['discountAmount'];

        $validCoupons = collect($discountResult['validCoupons']);

        if ($validCoupons->isNotEmpty()) {
            // Tách mã VIP distributed và mã thường
            $distributedCouponIds = [];
            $regularCouponIds = [];

            foreach ($validCoupons as $coupon) {
                if (isset($coupon->_distributed_coupon_id)) {
                    $distributedCouponIds[] = $coupon->_distributed_coupon_id;
                    $regularCouponIds[] = $coupon->id; // vẫn cần lock coupon template
                } else {
                    $regularCouponIds[] = $coupon->id;
                }
            }

            $regularCouponIds = array_unique($regularCouponIds);

            // Lock và increment used_count cho coupon template thường
            $data->validCoupons = Coupon::whereIn('id', $regularCouponIds)->lockForUpdate()->get();

            foreach ($data->validCoupons as $coupon) {
                if (! $coupon->isValid()) {
                    throw new Exception("Mã {$coupon->code} vừa mới hết lượt sử dụng. Vui lòng chọn lại.");
                }
                $coupon->increment('used_count');
            }

            // Đánh dấu mã VIP distributed đã sử dụng
            if (! empty($distributedCouponIds)) {
                $data->distributedCouponIds = $distributedCouponIds;
            }
        } else {
            $data->validCoupons = collect();
        }

        return $next($data);
    }
}
