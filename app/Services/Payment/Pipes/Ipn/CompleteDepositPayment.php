<?php

namespace App\Services\Payment\Pipes\Ipn;

use App\DTO\Payment\IpnData;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Events\PaymentCompleted;
use Closure;

class CompleteDepositPayment
{
    /**
     * Xử lý khi nạp tiền vào ví thành công
     */
    public function handle(IpnData $data, Closure $next)
    {
        // Bỏ qua nếu không phải giao dịch thành công hoặc không phải loại NẠP TIỀN
        if ($data->callbackData['status'] !== 'success' || !str_starts_with($data->transactionCode, 'DEP_')) {
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

        // Xử lý nạp tiền vào ví
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $payment->user_id],
            ['balance' => 0]
        );

        $balanceBefore = $wallet->balance;
        
        $wallet->balance += $payment->amount;
        $wallet->save();

        WalletTransaction::create([
            'user_id' => $payment->user_id,
            'wallet_id' => $wallet->id,
            'type' => 'deposit',
            'amount' => $payment->amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $wallet->balance,
            'status' => 'completed',
            'reference_code' => $payment->transaction_code,
            'description' => 'Nạp tiền vào ví qua ' . strtoupper($payment->payment_gateway),
        ]);

        // Phát sự kiện thanh toán hoàn tất
        event(new PaymentCompleted($payment->user_id, $data->transactionCode));

        $data->isSuccess = true;

        return $next($data);
    }
}
