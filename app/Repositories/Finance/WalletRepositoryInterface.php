<?php
declare(strict_types=1);
namespace App\Repositories\Finance;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WalletRepositoryInterface
{
    public function getWalletInfo(int $userId): ?array;
    public function getWalletTransactions(int $userId, array $filters = []): LengthAwarePaginator;
    public function getOnlinePayments(int $userId, array $filters = []): LengthAwarePaginator;
    public function getBankAccounts(int $userId): Collection;
    public function addBankAccount(int $userId, array $data): \App\Models\UserBankAccount;
    public function updateBankAccount(int $userId, int $bankAccountId, array $data): \App\Models\UserBankAccount;
    public function deleteBankAccount(int $userId, int $bankAccountId): bool;
    public function setDefaultBankAccount(int $userId, int $bankAccountId): bool;
}
