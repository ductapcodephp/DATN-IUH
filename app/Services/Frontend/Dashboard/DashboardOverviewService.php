<?php
declare(strict_types=1);
namespace App\Services\Frontend\Dashboard;
use App\Repositories\Frontend\Dashboard\DashboardOverviewRepositoryInterface;
use App\Repositories\Frontend\Dashboard\WalletRepositoryInterface;
use App\Repositories\Frontend\Dashboard\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DashboardOverviewService
{
    public function __construct(
        protected DashboardOverviewRepositoryInterface $overviewRepository,
        protected WalletRepositoryInterface $walletRepository,
        protected OrderRepositoryInterface $orderRepository
    ) {}

    public function getDashboardOverview(int $userId): array
    {
        return [
            'stats'        => $this->overviewRepository->getDashboardStats($userId),
            'wallet'       => $this->walletRepository->getWalletInfo($userId),
            'recentOrders' => $this->orderRepository->getOrders($userId),
        ];
    }
    public function getEnrolledCourses(int $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->overviewRepository->getEnrolledCourses($userId, $filters);
    }
    public function getCertificates(int $userId): Collection
    {
        return $this->overviewRepository->getCertificates($userId);
    }
}
