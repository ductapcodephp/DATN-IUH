<?php

declare(strict_types=1);

namespace App\Http\Resources\Seller;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistributedCouponResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar' => $this->user->avatar ?? null,
            ],
            'vip_package' => [
                'id' => $this->vipPackage->id,
                'name' => $this->vipPackage->name,
            ],
            'coupon_template' => $this->whenLoaded('coupon', function () {
                return [
                    'id' => $this->coupon->id,
                    'type' => $this->coupon->type,
                    'value' => (int) $this->coupon->value,
                    'value_formatted' => $this->coupon->type === 'percent'
                        ? $this->coupon->value.'%'
                        : number_format((float) $this->coupon->value, 0, ',', '.').' đ',
                    'course_id' => $this->coupon->course_id,
                ];
            }),
            'is_used' => (bool) $this->is_used,
            'used_at' => $this->used_at,
            'used_at_formatted' => $this->used_at ? $this->used_at->format('d/m/Y H:i') : null,
            'expires_at' => $this->expires_at,
            'expires_at_formatted' => $this->expires_at ? $this->expires_at->format('d/m/Y H:i') : 'Không giới hạn',
            'distributed_at' => $this->distributed_at,
            'distributed_at_formatted' => $this->distributed_at ? $this->distributed_at->format('d/m/Y H:i') : null,
            'created_at' => $this->created_at,
        ];
    }
}
