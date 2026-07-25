<?php

namespace App\DTO\Seller\VipPackage;

use Illuminate\Http\Request;

readonly class BuyVipData
{
    public function __construct(
        public int $packageId,
        public string $paymentMethod
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->package_id,
            $request->payment_method
        );
    }
}