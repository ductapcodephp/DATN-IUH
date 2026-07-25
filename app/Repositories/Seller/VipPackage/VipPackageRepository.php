<?php

namespace App\Repositories\Seller\VipPackage;

use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Models\Wallet;
use App\Models\Order;
use App\Models\OnlinePayment;
use Carbon\Carbon;

class VipPackageRepository implements VipPackageRepositoryInterface
{
    public function getActiveSellerPackages()
    {
        return VipPackage::active()->forRole('seller')->ordered()->get();
    }

    public function getActiveSubscriptionsForUser(int $userId)
    {
        return VipSubscription::with('vipPackage')
            ->where('user_id', $userId)
            ->active()
            ->get();
    }

    public function findSellerPackage(int $id)
    {
        return VipPackage::forRole('seller')->findOrFail($id);
    }

    public function findWalletByUserId(int $userId)
    {
        return Wallet::where('user_id', $userId)->first();
    }

    public function createOrder(array $data)
    {
        return Order::create($data);
    }

    public function getActiveSubscriptionOfSameType(int $userId, $package)
    {
        return VipSubscription::where('user_id', $userId)
            ->whereHas('vipPackage', fn ($q) => $q->where('role_type', $package->role_type)->where('package_type', $package->package_type))
            ->active()
            ->first();
    }

    public function extendSubscription($subscription, int $days)
    {
        $subscription->update([
            'expires_at' => Carbon::parse($subscription->expires_at)->addDays($days),
        ]);
        return $subscription;
    }

    public function cancelSubscription($subscription)
    {
        $subscription->update(['status' => 'cancelled']);
    }

    public function createSubscription(array $data)
    {
        return VipSubscription::create($data);
    }

    public function updateOrderVipSubscription(int $orderId, int $subscriptionId)
    {
        Order::where('id', $orderId)->update(['vip_subscription_id' => $subscriptionId]);
    }

    public function createOnlinePayment(array $data)
    {
        return OnlinePayment::create($data);
    }
}