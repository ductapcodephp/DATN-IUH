<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Coupons;

use App\Models\Coupon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        $coupon = $this->route('coupon');

        return auth()->check() && $coupon instanceof Coupon && (int) $coupon->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        $couponId = $this->route('coupon')->id;

        return [
            'code' => ['required', 'string', 'max:50', 'unique:coupons,code,'.$couponId],
            'type' => ['required', 'string', 'in:percent,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'course_id' => ['nullable', 'integer', 'exists:courses,id'],
            'vip_package_ids' => ['nullable', 'array'],
            'vip_package_ids.*' => ['integer', 'exists:vip_packages,id'],
            'is_active' => ['boolean'],
        ];
    }
}
