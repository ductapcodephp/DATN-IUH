<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller;

use App\DTO\Seller\Coupon\CouponData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Coupons\StoreCouponRequest;
use App\Http\Requests\Seller\Coupons\UpdateCouponRequest;
use App\Models\Coupon;
use App\Services\Seller\Coupons\CouponService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function __construct(
        protected CouponService $couponService
    ) {}

    public function index(): Response
    {
        $coupons = $this->couponService->getSellerCoupons((int) auth()->id());
        $courses = \App\Models\Course::where('seller_id', auth()->id())->select('id', 'title')->get();

        return Inertia::render('Seller/Coupons/Index', [
            'coupons' => $coupons,
            'courses' => $courses,
        ]);
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $dto = CouponData::fromRequest($request);
        $this->couponService->createCoupon((int) auth()->id(), $dto);

        return back()->with('success', 'Đã tạo mã giảm giá thành công!');
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $dto = CouponData::fromRequest($request);
        $this->couponService->updateCoupon($coupon, (int) auth()->id(), $dto);

        return back()->with('success', 'Đã cập nhật mã giảm giá!');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $this->authorizeAccess($coupon);

        $this->couponService->deleteCoupon($coupon);

        return back()->with('success', 'Đã xóa mã giảm giá!');
    }

    public function toggleStatus(Coupon $coupon): RedirectResponse
    {
        $this->authorizeAccess($coupon);

        $this->couponService->toggleStatus($coupon);

        return back();
    }

    /**
     * Helper kiểm tra phân quyền cho các route không dùng Form Request riêng (destroy, toggleStatus)
     */
    protected function authorizeAccess(Coupon $coupon): void
    {
        if ((int) $coupon->seller_id !== (int) auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác trên mã giảm giá này!');
        }
    }
}