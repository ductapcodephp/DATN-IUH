<?php

namespace App\Services\Finance\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use Illuminate\Support\Str;
use Closure;
use Exception;

class CalculateTotal
{
    /**
     * Tính tổng tiền thanh toán sau khi trừ giảm giá và tạo mã giao dịch.
     */
    public function handle(CheckoutData $data, Closure $next)
    {
        $data->finalAmount = $data->totalAmount - $data->discountAmount;

        if ($data->finalAmount <= 0) {
            throw new Exception('Số tiền thanh toán không hợp lệ.');
        }

        $data->transactionCode = strtoupper($data->gatewayName) . '_' . time() . '_' . Str::random(5);

        return $next($data);
    }
}
