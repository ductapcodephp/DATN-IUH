<?php

declare(strict_types=1);

namespace App\Services\Frontend\Dashboard;

use App\Repositories\Frontend\Dashboard\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderService
{
    public function __construct(protected OrderRepositoryInterface $orderRepository) {}

    public function getOrders(int $userId, array $filters = []): LengthAwarePaginator
    {
        return $this->orderRepository->getOrders($userId, $filters);
    }

    public function getOrderDetail(int $userId, int $orderId): ?array
    {
        return $this->orderRepository->getOrderDetail($userId, $orderId);
    }
}
