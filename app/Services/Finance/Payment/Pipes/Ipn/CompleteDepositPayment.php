<?php

namespace App\Services\Finance\Payment\Pipes\Ipn;

use App\DTO\Payment\IpnData;
use App\Events\PaymentCompleted;
use App\Models\Wallet;
use App\Models\WalletBonus;
use Closure;

class CompleteDepositPayment
{
    /**
     * Xử lý khi nạp tiền vào ví thành công
     */
    public function handle(IpnData $data, Closure $next)
    {
        // Bỏ qua nếu không phải giao dịch thành công hoặc không phải loại NẠP TIỀN
        if ($data->callbackData['status'] !== 'success' || ! str_starts_with($data->transactionCode, 'DEP_')) {
            return $next($data);
        }

        $payment = $data->payment;

        // Cập nhật trạng thái thanh toán
        $payment->update([
            'status' => 'completed',
            'gateway_transaction_id' => $data->callbackData['gateway_transaction_id'] ?? null,
            'raw_response' => $data->callbackData['raw_response'] ?? $data->callbackData,
            'paid_at' => now(),
        ]);

        // Tính tiền thưởng nạp (Bonus Top-up) từ database
        $amount = (float) $payment->amount;
        $bonus = 0;

        $applicableBonus = WalletBonus::where('is_active', true)
            ->where('min_amount', '<=', $amount)
            ->orderByDesc('min_amount')
            ->first();

        if ($applicableBonus) {
            $bonus = $amount * ($applicableBonus->bonus_percentage / 100);

            if (! is_null($applicableBonus->max_bonus_amount) && $bonus > $applicableBonus->max_bonus_amount) {
                $bonus = (float) $applicableBonus->max_bonus_amount;
            }
        }

        $totalAmount = $amount + $bonus;

        // Xử lý nạp tiền vào ví
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $payment->user_id],
            ['balance' => 0, 'balance_available' => 0, 'balance_pending' => 0]
        );

        $description = 'Nạp tiền vào ví qua '.strtoupper($payment->payment_gateway);
        if ($bonus > 0) {
            $description .= ' (Bao gồm '.number_format($bonus, 0, ',', '.').'đ tiền thưởng nạp)';
        }

        $wallet->deposit($totalAmount, $description, $payment->transaction_code);

        // Phát sự kiện thanh toán hoàn tất
        event(new PaymentCompleted($payment->user_id, $data->transactionCode));

        $data->isSuccess = true;

        return $next($data);
    }
}
