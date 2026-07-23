<?php

declare(strict_types=1);

namespace App\Repositories\Frontend\Dashboard;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderRepository implements OrderRepositoryInterface
{
    public function getOrders(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Order::with(['course:id,title,thumbnail,slug', 'coupon:id,code,discount_value,discount_type'])->where('user_id', $userId);
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (! empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }
        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function getOrderDetail(int $userId, int $orderId): ?array
    {
        $order = Order::with(['course:id,title,thumbnail,slug,price', 'coupon:id,code,discount_value,discount_type'])
            ->where('user_id', $userId)->where('id', $orderId)->first();

        return $order ? $order->toArray() : null;
    }
}
