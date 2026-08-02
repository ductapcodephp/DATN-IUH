<?php

namespace App\Console\Commands;

use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReleaseSellerEarnings extends Command
{
    protected $signature = 'seller:release-earnings {--days=3 : Số ngày chờ giải phóng}';

    protected $description = 'Giải phóng thu nhập (pending -> available) cho Seller sau N ngày chờ';

    public function handle()
    {
        $days = (int) $this->option('days');
        $releaseBeforeDate = Carbon::now()->subMinute(1);

        $this->info("Bắt đầu giải phóng tiền chờ cho Seller (trước {$releaseBeforeDate->toDateTimeString()})...");

        $pendingEarnings = WalletTransaction::with(['order', 'wallet'])
            ->earnings()
            ->pending()
            ->where('created_at', '<=', $releaseBeforeDate)
            ->get();

        if ($pendingEarnings->isEmpty()) {
            $this->info('Không có giao dịch nào đủ điều kiện giải phóng.');

            return;
        }

        $count = 0;
        foreach ($pendingEarnings as $transaction) {
            $order = $transaction->order;

            if (! $order) {
                Log::warning("Earning transaction #{$transaction->id} thiếu thông tin Order liên kết.");

                continue;
            }

            if ($order->isRefunded()) {
                DB::table('wallet_transactions')
                    ->where('id', $transaction->id)
                    ->update([
                        'status' => WalletTransaction::STATUS_FAILED,
                        'updated_at' => now(),
                        'description' => $transaction->description.' (Hủy do Refund)',
                    ]);

                if ($transaction->wallet) {
                    $transaction->wallet->decrement('balance_pending', $transaction->amount);
                    $transaction->wallet->decrement('balance', $transaction->amount);
                }

                $this->warn("Đã hủy giải phóng thu nhập #{$transaction->id} vì đơn hàng đã Refund.");

                continue;
            }

            try {
                if ($transaction->wallet) {
                    $transaction->wallet->releaseEarning(
                        $transaction,
                        (float) $order->commission_amount,
                        (float) $order->seller_amount
                    );
                    $count++;
                    $this->line("Đã giải phóng thành công thu nhập #{$transaction->id} cho Seller ID: {$transaction->user_id}");
                }
            } catch (\Exception $e) {
                Log::error("Lỗi khi giải phóng tiền cho Earning #{$transaction->id}: ".$e->getMessage());
                $this->error("Lỗi giải phóng Earning #{$transaction->id}.");
            }
        }

        $this->info("Hoàn tất! Đã giải phóng $count giao dịch.");
    }
}
