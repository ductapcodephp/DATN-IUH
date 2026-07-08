<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Coupon;

use Illuminate\Http\Request;

readonly class CouponData
{
    public function __construct(
        public string $code,
        public string $type,
        public float $value,
        public ?int $maxUses,
        public ?string $startsAt,
        public ?string $expiresAt,
        public bool $isActive,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            code: strtoupper(trim((string) $request->input('code'))),
            type: trim((string) $request->input('type')),
            value: (float) $request->input('value'),
            maxUses: $request->filled('max_uses') ? (int) $request->input('max_uses') : null,
            startsAt: $request->filled('starts_at') ? (string) $request->input('starts_at') : null,
            expiresAt: $request->filled('expires_at') ? (string) $request->input('expires_at') : null,
            isActive: $request->boolean('is_active', true),
        );
    }

    public function toArray(int $sellerId): array
    {
        return [
            'seller_id'  => $sellerId,
            'code'       => $this->code,
            'type'       => $this->type,
            'value'      => $this->value,
            'max_uses'   => $this->maxUses,
            'starts_at'  => $this->startsAt,
            'expires_at' => $this->expiresAt,
            'is_active'  => $this->isActive,
        ];
    }
}