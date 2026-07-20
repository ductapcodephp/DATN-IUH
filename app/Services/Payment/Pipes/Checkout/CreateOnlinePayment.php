<?php

namespace App\Services\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use App\Models\OnlinePayment;
use Closure;

class CreateOnlinePayment
{
    /**
     * Tạo hoặc cập nhật bản ghi OnlinePayment (trạng thái pending).
     */
    public function handle(CheckoutData $data, Closure $next)
    {
        $data->onlinePayment = OnlinePayment::updateOrCreate(
            [
                'user_id' => $data->userId,
                'status' => 'pending',
            ],
            [
                'payment_gateway' => $data->gatewayName,
                'transaction_code' => $data->transactionCode,
                'amount' => $data->finalAmount,
            ]
        );

        return $next($data);
    }
}
