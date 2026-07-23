<?php

namespace App\Services\Finance\Payment;

use Exception;

class PaymentGatewayFactory
{
    /**
     * @throws Exception
     */
    public static function create(string $gateway): PaymentGatewayInterface
    {
        return match ($gateway) {
            'vnpay' => new VnpayGateway,
            'stripe' => new StripeGateway,
            default => throw new Exception("Phương thức thanh toán [{$gateway}] không được hỗ trợ."),
        };
    }
}
