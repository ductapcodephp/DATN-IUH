<?php

namespace App\Services\Finance\Payment\Pipes\Ipn;

use App\DTO\Payment\IpnData;
use App\Exceptions\PaymentException;
use App\Models\OnlinePayment;
use Closure;

class ValidateIpnPayment
{
    public function handle(IpnData $data, Closure $next)
    {
        if (empty($data->transactionCode)) {
            throw new PaymentException(
                'Không tìm thấy mã giao dịch gốc.',
                PaymentException::ORDER_NOT_FOUND
            );
        }

        $payment = OnlinePayment::with('orders.course')
            ->where('transaction_code', $data->transactionCode)
            ->lockForUpdate()
            ->first();

        if (! $payment) {
            throw new PaymentException(
                'Không tìm thấy giao dịch trong hệ thống.',
                PaymentException::ORDER_NOT_FOUND
            );
        }

        if ($payment->status === 'completed') {
            throw new PaymentException(
                'Giao dịch đã được cập nhật.',
                PaymentException::ORDER_ALREADY_CONFIRMED
            );
        }

        $data->payment = $payment;

        return $next($data);
    }
}
