<?php

declare(strict_types=1);

namespace App\Services\Seller\Coupons;

use App\DTO\Seller\Coupon\CouponData;
use App\Models\Coupon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CouponServiceInterface
{
    public function getSellerCoupons(int $sellerId): LengthAwarePaginator;

    public function createCoupon(int $sellerId, CouponData $dto): Coupon;

    public function updateCoupon(Coupon $coupon, int $sellerId, CouponData $dto): bool;

    public function deleteCoupon(Coupon $coupon): bool;

    public function toggleStatus(Coupon $coupon): bool;
}
