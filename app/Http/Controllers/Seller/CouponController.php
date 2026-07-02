<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        // Lấy danh sách coupon của seller hiện tại, phân trang 10 items/trang
        $coupons = Coupon::where('seller_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Seller/Coupons/Index', [
            'coupons' => $coupons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean'
        ]);

        $validated['seller_id'] = auth()->id();

        Coupon::create($validated);

        return back()->with('success', 'Đã tạo mã giảm giá thành công!');
    }

    public function update(Request $request, Coupon $coupon)
    {
        // Đảm bảo chỉ seller sở hữu mới được sửa
        if ($coupon->seller_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean'
        ]);

        $coupon->update($validated);

        return back()->with('success', 'Đã cập nhật mã giảm giá!');
    }

    public function destroy(Coupon $coupon)
    {
        if ($coupon->seller_id !== auth()->id()) {
            abort(403);
        }

        $coupon->delete();

        return back()->with('success', 'Đã xóa mã giảm giá!');
    }
    public function toggleStatus(Coupon $coupon)
    {
        if ($coupon->seller_id !== auth()->id()) {
            abort(403);
        }

        $coupon->update([
            'is_active' => !$coupon->is_active
        ]);

        return back(); // Inertia sẽ tự reload data mà không cần load lại trang
    }
}
