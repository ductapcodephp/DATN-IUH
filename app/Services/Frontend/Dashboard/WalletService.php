<?php
declare(strict_types=1);
namespace App\Services\Frontend\Dashboard;
use App\Repositories\Frontend\Dashboard\WalletRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class WalletService
{
    public function __construct(protected WalletRepositoryInterface $walletRepository) {}

    public function getWalletInfo(int $userId): ?array
    {
        return $this->walletRepository->getWalletInfo($userId);
    }
    public function getWalletTransactions(int $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->walletRepository->getWalletTransactions($userId, $filters);
    }
    public function getOnlinePayments(int $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->walletRepository->getOnlinePayments($userId, $filters);
    }
    public function getBankAccounts(int $userId): Collection
    {
        return $this->walletRepository->getBankAccounts($userId);
    }
    public function addBankAccount(int $userId, array $data): \App\Models\UserBankAccount
    {
        return $this->walletRepository->addBankAccount($userId, $data);
    }
    public function updateBankAccount(int $userId, int $bankAccountId, array $data): \App\Models\UserBankAccount
    {
        return $this->walletRepository->updateBankAccount($userId, $bankAccountId, $data);
    }
    public function deleteBankAccount(int $userId, int $bankAccountId): bool
    {
        return $this->walletRepository->deleteBankAccount($userId, $bankAccountId);
    }
    public function setDefaultBankAccount(int $userId, int $bankAccountId): bool
    {
        return $this->walletRepository->setDefaultBankAccount($userId, $bankAccountId);
    }
}
