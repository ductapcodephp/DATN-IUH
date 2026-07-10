<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Coupons;

use App\Models\Coupon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CouponRepositoryInterface
{
    public function getPaginatedBySeller(int $sellerId, int $perPage = 10): LengthAwarePaginator;

    public function create(array $data): Coupon;

    public function update(Coupon $coupon, array $data): bool;

    public function delete(Coupon $coupon): bool;

    public function toggleStatus(Coupon $coupon): bool;
}
