<?php

namespace App\Services\Finance\Payment;

use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    public function getPaymentUrl(float $amount, string $transactionCode): string;

    public function handleCallback(Request $request): array;
}
