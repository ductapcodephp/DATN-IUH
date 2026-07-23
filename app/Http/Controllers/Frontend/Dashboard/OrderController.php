<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Dashboard\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    public function index(Request $request): Response
    {
        $userId = Auth::id();
        $filters = $request->only(['status', 'payment_method', 'date_from', 'date_to']);

        $orders = $this->orderService->getOrders($userId, $filters);

        return Inertia::render('Frontend/Dashboard/Orders', [
            'orders' => $orders,
            'filters' => $filters,
        ]);
    }

    public function show(int $orderId): Response
    {
        $userId = Auth::id();
        $order = $this->orderService->getOrderDetail($userId, $orderId);

        if (! $order) {
            abort(404, 'Đơn hàng không tồn tại.');
        }

        return Inertia::render('Frontend/Dashboard/OrderDetail', [
            'order' => $order,
        ]);
    }
}
