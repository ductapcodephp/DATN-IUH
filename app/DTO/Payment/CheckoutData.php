<?php

namespace App\DTO\Payment;

use Illuminate\Support\Collection;
use App\Models\OnlinePayment;
use Illuminate\Http\Request;
class CheckoutData
{
    // Dữ liệu đầu vào (immutable)
    public readonly int $userId;
    public readonly string $gatewayName;
    public readonly array $couponIds;

    // Dữ liệu được gán dần qua từng Pipe
    public ?Collection $cartItems = null;
    public float $totalAmount = 0;
    public float $discountAmount = 0;
    public float $finalAmount = 0;
    public ?Collection $validCoupons = null;
    public ?OnlinePayment $onlinePayment = null;
    public string $transactionCode = '';

    public function __construct(int $userId, string $gatewayName, array $couponIds = [])
    {
        $this->userId = $userId;
        $this->gatewayName = $gatewayName;
        $this->couponIds = $couponIds;
        $this->validCoupons = collect();
    }

    public static function fromRequest(Request $request, int $userId): self
    {
        return new self(
            $userId,
            $request->input('gateway', 'vnpay'),
            $request->input('coupon_ids', [])
        );
    }
}
