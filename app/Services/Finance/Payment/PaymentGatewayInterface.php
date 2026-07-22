<?php

namespace App\Services\Finance\Payment;

use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     *
     * @param float $amount 
     * @param string $transactionCode
     * @return string 
     */
    public function getPaymentUrl(float $amount, string $transactionCode): string;

    /**
     *
     * @param Request $request
     * @return array 
     */
    public function handleCallback(Request $request): array;
}
