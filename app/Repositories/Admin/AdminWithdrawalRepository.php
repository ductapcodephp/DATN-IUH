<?php

namespace App\Repositories\Admin;

class AdminWithdrawalRepository
{
    public function approve($id, $adminNote = null)
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($id, $adminNote) {
            $request = \App\Models\WithdrawalRequest::lockForUpdate()->findOrFail($id);

            if ($request->status !== 'pending') {
                throw new \Exception('Yêu cầu này đã được xử lý trước đó.');
            }

            $request->update([
                'status' => 'approved',
                'admin_note' => $adminNote,
            ]);

            $tx = \App\Models\WalletTransaction::where('user_id', $request->user_id)
                ->where('type', \App\Models\WalletTransaction::TYPE_WITHDRAWAL)
                ->where('status', \App\Models\WalletTransaction::STATUS_PENDING)
                ->where('amount', $request->amount)
                ->latest()
                ->first();

            if ($tx) {
                \Illuminate\Support\Facades\DB::table('wallet_transactions')
                    ->where('id', $tx->id)
                    ->update([
                        'status' => \App\Models\WalletTransaction::STATUS_COMPLETED,
                        'updated_at' => now(),
                        'metadata' => json_encode(array_merge($tx->metadata ?? [], [
                            'admin_note' => $adminNote,
                            'approved_at' => now()->toISOString(),
                        ]))
                    ]);
            }

            return $request;
        });
    }

    public function reject($id, $adminNote = null)
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($id, $adminNote) {
            $request = \App\Models\WithdrawalRequest::lockForUpdate()->findOrFail($id);

            if ($request->status !== 'pending') {
                throw new \Exception('Yêu cầu này đã được xử lý trước đó.');
            }

            $request->update([
                'status' => 'rejected',
                'admin_note' => $adminNote,
            ]);

            $tx = \App\Models\WalletTransaction::where('user_id', $request->user_id)
                ->where('type', \App\Models\WalletTransaction::TYPE_WITHDRAWAL)
                ->where('status', \App\Models\WalletTransaction::STATUS_PENDING)
                ->where('amount', $request->amount)
                ->latest()
                ->first();

            if ($tx) {
                \Illuminate\Support\Facades\DB::table('wallet_transactions')
                    ->where('id', $tx->id)
                    ->update([
                        'status' => \App\Models\WalletTransaction::STATUS_FAILED,
                        'updated_at' => now(),
                        'metadata' => json_encode(array_merge($tx->metadata ?? [], [
                            'admin_note' => $adminNote,
                            'rejected_at' => now()->toISOString(),
                        ]))
                    ]);
            }

            // Hoàn tiền lại cho ví
            $wallet = \App\Models\Wallet::where('user_id', $request->user_id)->lockForUpdate()->first();
            if ($wallet) {
                $wallet->increment('balance_available', $request->amount);
                $wallet->increment('balance', $request->amount);
            }

            return $request;
        });
    }
}
