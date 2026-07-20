<?php

declare(strict_types=1);

namespace App\Http\Resources\Seller;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'type' => $this->type,
            'value' => (int) $this->value,
            'value_formatted' => $this->type === 'percent' 
                ? $this->value . '%' 
                : number_format((float) $this->value, 0, ',', '.') . ' đ',
            'max_uses' => $this->max_uses,
            'used_count' => $this->used_count ?? 0,
            'course_id' => $this->course_id,
            'is_active' => (bool) $this->is_active,
            
            'starts_at' => $this->starts_at,
            'expires_at' => $this->expires_at,

            'starts_at_formatted' => $this->starts_at ? $this->starts_at->format('d/m/Y H:i') : 'Không giới hạn',
            'expires_at_formatted' => $this->expires_at ? $this->expires_at->format('d/m/Y H:i') : 'Không giới hạn',
        ];
    }
}
