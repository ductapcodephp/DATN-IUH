<?php

declare(strict_types=1);

namespace App\DTO\Finance;

use Illuminate\Http\Request;

readonly class WithdrawalData
{
    public function __construct(
        public int $userId,
        public float $amount,
        public int $bankAccountId
    ) {}

    public static function fromRequest(Request $request, int $userId): self
    {
        return new self(
            $userId,
            (float) $request->input('amount'),
            (int) $request->input('bank_account_id')
        );
    }
}
