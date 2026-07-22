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
}
