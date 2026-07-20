<?php

namespace App\DTO\Payment;

use App\Models\OnlinePayment;

class IpnData
{
    // Dữ liệu đầu vào từ callback
    public readonly array $callbackData;
    public readonly string $transactionCode;

    // Dữ liệu được gán qua từng Pipe
    public ?OnlinePayment $payment = null;
    public bool $isSuccess = false;

    public function __construct(array $callbackData)
    {
        $this->callbackData = $callbackData;
        $this->transactionCode = $callbackData['transaction_code'] ?? '';
    }

    public static function fromCallback(array $callbackData): self
    {
        return new self($callbackData);
    }
}
