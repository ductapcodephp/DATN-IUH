<?php
declare(strict_types=1);
namespace App\Repositories\Frontend\Dashboard;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function getOrders(int $userId, array $filters = []): LengthAwarePaginator;
    public function getOrderDetail(int $userId, int $orderId): ?array;
}
