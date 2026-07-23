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
                'seller_storage_limit' => $request->user() && $request->user()->isSeller() ? $request->user()->getSellerStorageLimitBytes() : 0,
                'seller_storage_used' => $request->user() && $request->user()->isSeller() ? $request->user()->getSellerStorageUsedBytes() : 0,
                'wishlisted_course_ids' => $request->user()
                    ? Wishlist::where('user_id', $request->user()->id)->pluck('course_id')->toArray()
                    : [],
                'unread_notifications' => $request->user() ? $request->user()->unreadNotifications()->limit(5)->get() : [],
                'unread_notifications_count' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
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
}
