<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\OnlinePayment;
use App\Mail\PaymentSuccessMail;

class SendPaymentSuccessEmail implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentCompleted $event): void
    {
        $userId = $event->userId;
        $txnCode = $event->transactionCode;

        Log::info("🔔 [Background Job] Đang tiến hành gửi Email hóa đơn cho User ID: {$userId}, Mã GD: {$txnCode}");

        $user = User::find($userId);
        $payments = OnlinePayment::with('orders.course')->where('transaction_code', 'LIKE', $txnCode . '%')->get();

        if ($user && $payments->isNotEmpty()) {
            Mail::to($user->email)->send(new PaymentSuccessMail($user, $payments));
            Log::info("✅ [Background Job] Đã gửi Email thành công cho giao dịch {$txnCode} đến {$user->email}");
        } else {
            Log::error("❌ [Background Job] Không tìm thấy User hoặc Giao dịch {$txnCode}");
        }
    }
}
