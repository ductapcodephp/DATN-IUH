<?php

namespace App\Http\Middleware;

use App\Models\VipPackage;
use App\Models\Wallet;
use App\Models\WalletBonus;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'wallet' => $request->user() ? Wallet::where('user_id', $request->user()->id)->first() : null,
                'isUserVip' => $request->user() ? $request->user()->isUserVip() : false,
                'isSellerVip' => $request->user() ? $request->user()->isSellerVip() : false,
                'userVipBadge' => $request->user() ? $request->user()->getUserVipBadgeText() : null,
                'sellerVipBadge' => $request->user() ? $request->user()->getSellerVipBadgeText() : null,
                'seller_storage_limit' => $request->user() && $request->user()->isSeller() ? $request->user()->getSellerStorageLimitBytes() : 0,
                'seller_storage_used' => $request->user() && $request->user()->isSeller() ? $request->user()->getSellerStorageUsedBytes() : 0,
                'wishlisted_course_ids' => $request->user()
                    ? Wishlist::where('user_id', $request->user()->id)->pluck('course_id')->toArray()
                    : [],
                'unread_notifications' => function () use ($request) {
                    return $this->getFilteredNotifications($request, true, 5);
                },
                'recent_notifications' => function () use ($request) {
                    return $this->getFilteredNotifications($request, false, 10);
                },
                'unread_notifications_count' => function () use ($request) {
                    if (!$request->user()) return 0;
                    $query = $request->user()->unreadNotifications();
                    $this->applyNotificationFilter($query, $request);
                    return $query->count();
                },
            ],
            'vip_packages' => VipPackage::active()->ordered()->get(),
            'wallet_bonuses' => WalletBonus::where('is_active', true)->orderBy('min_amount')->get(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'system' => fn () => $request->session()->get('errors') ? $request->session()->get('errors')->first('system') : null,
            ],
        ]);
    }

    /**
     * Lấy danh sách notifications đã được lọc theo vai trò (Admin, Seller, Frontend)
     */
    protected function getFilteredNotifications(Request $request, bool $unreadOnly = false, int $limit = 5)
    {
        if (!$request->user()) {
            return [];
        }

        $query = $unreadOnly 
            ? $request->user()->unreadNotifications() 
            : $request->user()->notifications();

        $this->applyNotificationFilter($query, $request);

        return $query->limit($limit)->get();
    }

    /**
     * Áp dụng điều kiện lọc type notification dựa trên URL hiện tại
     */
    protected function applyNotificationFilter($query, Request $request)
    {
        if ($request->is('admin*')) {
            $query->where('type', 'like', 'App\Notifications\Admin\%');
        } elseif ($request->is('seller*')) {
            $query->where('type', 'like', 'App\Notifications\Seller\%');
        } else {
            // Frontend hoặc Dashboard học viên: Loại trừ thông báo của Admin và Seller
            $query->where('type', 'not like', 'App\Notifications\Admin\%')
                  ->where('type', 'not like', 'App\Notifications\Seller\%');
        }
    }
}
