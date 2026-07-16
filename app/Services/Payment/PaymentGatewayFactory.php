<?php

namespace App\Services\Payment;

use Exception;

class PaymentGatewayFactory
{
    /**
     * Create a new payment gateway instance based on the given gateway name.
     *
     * @param string $gateway
     * @return PaymentGatewayInterface
     * @throws Exception
     */
    public static function create(string $gateway): PaymentGatewayInterface
    {
        return match ($gateway) {
            'vnpay' => new VnpayGateway(),
            'stripe' => new StripeGateway(),
            default => throw new Exception("Phương thức thanh toán [{$gateway}] không được hỗ trợ."),
        };
    }
}
