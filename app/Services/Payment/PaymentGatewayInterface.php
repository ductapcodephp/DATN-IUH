<?php

namespace App\Services\Payment;

use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Khởi tạo luồng thanh toán và trả về URL chuyển hướng (hoặc Inertia Response).
     *
     * @param float $amount Số tiền cần thanh toán
     * @param string $transactionCode Mã giao dịch gốc
     * @return string URL chuyển hướng tới cổng thanh toán
     */
    public function getPaymentUrl(float $amount, string $transactionCode): string;

    /**
     * Xử lý dữ liệu trả về từ cổng thanh toán.
     *
     * @param Request $request
     * @return array Gồm 'status' (success, failed, invalid), 'transaction_code', 'gateway_transaction_id', 'raw_response'
     */
    public function handleCallback(Request $request): array;
}
