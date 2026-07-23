<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\DTO\Finance\WithdrawalData;
use App\Models\UserBankAccount;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface WalletRepositoryInterface
{
    public function getWalletInfo(int $userId): ?array;

    public function getWalletTransactions(int $userId, array $filters = []): LengthAwarePaginator;

    public function getOnlinePayments(int $userId, array $filters = []): LengthAwarePaginator;

    public function getBankAccounts(int $userId): Collection;

    public function addBankAccount(int $userId, array $data): UserBankAccount;

    public function updateBankAccount(int $userId, int $bankAccountId, array $data): UserBankAccount;

    public function deleteBankAccount(int $userId, int $bankAccountId): bool;

    public function setDefaultBankAccount(int $userId, int $bankAccountId): bool;

    public function getTotalWithdrawn(int $userId): float;

    public function getRevenueTransactions(int $userId): LengthAwarePaginator;

    public function getUnifiedRevenueTransactions(int $userId, array $filters = []): LengthAwarePaginator;

    public function processWithdrawal(WithdrawalData $data): WalletTransaction;
}
