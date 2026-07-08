<?php

declare(strict_types=1);

namespace App\Services\Seller\Coupons;

use App\DTO\Seller\Course\Coupon\CouponData;
use App\Models\Coupon;
use App\Repositories\Seller\Coupons\CouponRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CouponService implements CouponServiceInterface
{
    public function __construct(
        protected CouponRepositoryInterface $couponRepository
    ) {}

    public function getSellerCoupons(int $sellerId): LengthAwarePaginator
    {
        return $this->couponRepository->getPaginatedBySeller($sellerId);
    }

    public function createCoupon(int $sellerId, CouponData $dto): Coupon
    {
        return $this->couponRepository->create($dto->toArray($sellerId));
    }

    public function updateCoupon(Coupon $coupon, int $sellerId, CouponData $dto): bool
    {
        return $this->couponRepository->update($coupon, $dto->toArray($sellerId));
    }

    public function deleteCoupon(Coupon $coupon): bool
    {
        return $this->couponRepository->delete($coupon);
    }

    public function toggleStatus(Coupon $coupon): bool
    {
        return $this->couponRepository->toggleStatus($coupon);
    }
}