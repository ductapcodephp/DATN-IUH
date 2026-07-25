<?php

namespace App\Repositories\Seller\VipPackage;

interface VipPackageRepositoryInterface
{
    public function getActiveSellerPackages();
    public function getActiveSubscriptionsForUser(int $userId);
    public function findSellerPackage(int $id);
    public function findWalletByUserId(int $userId);
    public function createOrder(array $data);
    public function getActiveSubscriptionOfSameType(int $userId, $package);
    public function extendSubscription($subscription, int $days);
    public function cancelSubscription($subscription);
    public function createSubscription(array $data);
    public function updateOrderVipSubscription(int $orderId, int $subscriptionId);
    public function createOnlinePayment(array $data);
}