<?php
declare(strict_types=1);
namespace App\Repositories\Finance;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\OnlinePayment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class WalletRepository implements WalletRepositoryInterface
{
    public function getWalletInfo(int $userId): ?array
    {
        $wallet = Wallet::where('user_id', $userId)->first();
        if (!$wallet) return null;
        $totalDeposited = WalletTransaction::where('user_id', $userId)->where('type', WalletTransaction::TYPE_DEPOSIT)->where('status', WalletTransaction::STATUS_COMPLETED)->sum('amount');
        $totalSpent = WalletTransaction::where('user_id', $userId)->whereIn('type', [WalletTransaction::TYPE_PURCHASE, WalletTransaction::TYPE_VIP_PAYMENT])->where('status', WalletTransaction::STATUS_COMPLETED)->sum('amount');
        $totalCompletedTransactions = WalletTransaction::where('user_id', $userId)->where('status', WalletTransaction::STATUS_COMPLETED)->count();
        return [
            'id' => $wallet->id, 
            'balance' => (float) $wallet->balance,
            'balance_available' => (float) $wallet->balance_available,
            'balance_pending' => (float) $wallet->balance_pending,
            'status' => $wallet->status,
            'total_deposited' => (float) $totalDeposited, 
            'total_spent' => (float) $totalSpent,
            'total_completed_transactions' => $totalCompletedTransactions,
            'created_at' => $wallet->created_at,
        ];
    }
    public function getWalletTransactions(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = WalletTransaction::where('user_id', $userId);
        if (!empty($filters['type'])) $query->where('type', $filters['type']);
        if (!empty($filters['status'])) $query->where('status', $filters['status']);
        if (!empty($filters['date_from'])) $query->whereDate('created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to'])) $query->whereDate('created_at', '<=', $filters['date_to']);
        return $query->orderBy('created_at', 'desc')->paginate(15);
    }
    public function getOnlinePayments(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = OnlinePayment::where('user_id', $userId);
        if (!empty($filters['type'])) $query->where('payment_gateway', $filters['type']);
        if (!empty($filters['status'])) $query->where('status', $filters['status']);
        if (!empty($filters['date_from'])) $query->whereDate('created_at', '>=', $filters['date_from']);
        if (!empty($filters['date_to'])) $query->whereDate('created_at', '<=', $filters['date_to']);
        return $query->orderBy('created_at', 'desc')->paginate(10, ['*'], 'online_page');
    }
    public function getBankAccounts(int $userId): Collection
    {
        return UserBankAccount::where('user_id', $userId)->orderBy('is_default', 'desc')->orderBy('created_at', 'desc')->get();
    }
    public function addBankAccount(int $userId, array $data): UserBankAccount
    {
        $isFirst = UserBankAccount::where('user_id', $userId)->count() === 0;
        if ($isFirst || (!empty($data['is_default']) && $data['is_default'])) {
            UserBankAccount::where('user_id', $userId)->update(['is_default' => false]);
        }
        return UserBankAccount::create([
            'user_id' => $userId, 'bank_name' => $data['bank_name'], 'account_name' => $data['account_name'],
            'account_number' => $data['account_number'], 'branch' => $data['branch'] ?? null,
            'is_default' => $isFirst || (!empty($data['is_default']) && $data['is_default']),
        ]);
    }
    public function updateBankAccount(int $userId, int $bankAccountId, array $data): UserBankAccount
    {
        $bankAccount = UserBankAccount::where('user_id', $userId)->findOrFail($bankAccountId);
        if (!empty($data['is_default']) && $data['is_default']) {
            UserBankAccount::where('user_id', $userId)->update(['is_default' => false]);
        }
        $bankAccount->update($data);
        return $bankAccount->fresh();
    }
    public function deleteBankAccount(int $userId, int $bankAccountId): bool
    {
        $bankAccount = UserBankAccount::where('user_id', $userId)->findOrFail($bankAccountId);
        $wasDefault = $bankAccount->is_default;
        $bankAccount->delete();
        if ($wasDefault) {
            $nextDefault = UserBankAccount::where('user_id', $userId)->oldest()->first();
            $nextDefault?->update(['is_default' => true]);
        }
        return true;
    }
    public function setDefaultBankAccount(int $userId, int $bankAccountId): bool
    {
        UserBankAccount::where('user_id', $userId)->update(['is_default' => false]);
        return (bool) UserBankAccount::where('user_id', $userId)->where('id', $bankAccountId)->update(['is_default' => true]);
    }

    public function getTotalWithdrawn(int $userId): float
    {
        return (float) WalletTransaction::where('user_id', $userId)
            ->where('type', WalletTransaction::TYPE_WITHDRAWAL)
            ->where('status', WalletTransaction::STATUS_COMPLETED)
            ->sum('amount');
    }

    public function getRevenueTransactions(int $userId): LengthAwarePaginator
    {
        return WalletTransaction::where('user_id', $userId)
            ->whereIn('type', [WalletTransaction::TYPE_WITHDRAWAL, WalletTransaction::TYPE_EARNING])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function getUnifiedRevenueTransactions(int $userId, array $filters = []): LengthAwarePaginator
    {
        // Query 1: Wallet Transactions (Earnings & Withdrawals)
        $walletQuery = \Illuminate\Support\Facades\DB::table('wallet_transactions')
            ->select(
                'id',
                'type',
                'amount',
                'status',
                'description',
                'created_at',
                \Illuminate\Support\Facades\DB::raw("'wallet' as source")
            )
            ->where('user_id', $userId)
            ->whereIn('type', [WalletTransaction::TYPE_WITHDRAWAL, WalletTransaction::TYPE_EARNING]);

        // Query 2: Online Payments
        $onlineQuery = \Illuminate\Support\Facades\DB::table('online_payments')
            ->select(
                'id',
                'payment_gateway as type',
                'amount',
                'status',
                \Illuminate\Support\Facades\DB::raw("CONCAT('Thanh toán qua cổng ', payment_gateway) as description"),
                'created_at',
                \Illuminate\Support\Facades\DB::raw("'online' as source")
            )
            ->where('user_id', $userId);

        if (!empty($filters['date_from'])) {
            $walletQuery->whereDate('created_at', '>=', $filters['date_from']);
            $onlineQuery->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $walletQuery->whereDate('created_at', '<=', $filters['date_to']);
            $onlineQuery->whereDate('created_at', '<=', $filters['date_to']);
        }
        
        $unifiedQuery = $walletQuery->union($onlineQuery)->orderBy('created_at', 'desc');
        
        // Paginate using query builder
        return $unifiedQuery->paginate(10);
    }

    public function processWithdrawal(\App\DTO\Finance\WithdrawalData $data): \App\Models\WalletTransaction
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            $wallet = Wallet::where('user_id', $data->userId)->lockForUpdate()->first();
            
            if (!$wallet || $wallet->balance_available < $data->amount) {
                throw new \Exception('Số dư khả dụng không đủ để rút tiền.');
            }

            $bankAccount = UserBankAccount::where('id', $data->bankAccountId)
                ->where('user_id', $data->userId)
                ->first();
                
            if (!$bankAccount) {
                throw new \Exception('Tài khoản ngân hàng không hợp lệ.');
            }

            $balanceBefore = $wallet->balance_available;
            
            $wallet->balance_available -= $data->amount;
            $wallet->balance -= $data->amount;
            $wallet->save();

            return WalletTransaction::create([
                'user_id' => $data->userId,
                'wallet_id' => $wallet->id,
                'type' => WalletTransaction::TYPE_WITHDRAWAL,
                'amount' => $data->amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $wallet->balance_available,
                'status' => WalletTransaction::STATUS_PENDING,
                'description' => 'Yêu cầu rút tiền về ' . $bankAccount->bank_name . ' (' . $bankAccount->account_number . ')',
                'metadata' => [
                    'bank_name' => $bankAccount->bank_name,
                    'account_name' => $bankAccount->account_name,
                    'account_number' => $bankAccount->account_number,
                    'branch' => $bankAccount->branch,
                ]
            ]);
        });
    }
}
