<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Coupons;

use App\Models\Coupon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CouponRepository implements CouponRepositoryInterface
{
    public function getPaginatedBySeller(int $sellerId, int $perPage = 10): LengthAwarePaginator
    {
        return Coupon::query()
            ->where('seller_id', $sellerId)
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Coupon
    {
        return Coupon::query()->create($data);
    }

    public function update(Coupon $coupon, array $data): bool
    {
        return $coupon->update($data);
    }

    public function delete(Coupon $coupon): bool
    {
        return $coupon->delete();
    }

    public function toggleStatus(Coupon $coupon): bool
    {
        return $coupon->update([
            'is_active' => ! $coupon->is_active,
        ]);
    }
}
