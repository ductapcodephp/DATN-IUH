<?php

namespace App\Http\Middleware;

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
                'wallet' => $request->user() ? \App\Models\Wallet::where('user_id', $request->user()->id)->first() : null,
                'vip' => $request->user() ? \App\Models\VipSubscription::with('vipPackage')->where('user_id', $request->user()->id)->active()->first() : null,
                'wishlisted_course_ids' => $request->user() 
                    ? \App\Models\Wishlist::where('user_id', $request->user()->id)->pluck('course_id')->toArray() 
                    : [],
            ],
            'vip_packages' => \App\Models\VipPackage::active()->ordered()->get(),
            'wallet_bonuses' => \App\Models\WalletBonus::where('is_active', true)->orderBy('min_amount')->get(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'system' => fn () => $request->session()->get('errors') ? $request->session()->get('errors')->first('system') : null,
            ],
        ]);
    }
}
