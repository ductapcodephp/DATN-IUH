<?php

namespace App\Services\Seller;

use App\Repositories\Seller\VipPackage\VipPackageRepositoryInterface;
use App\DTO\Seller\VipPackage\BuyVipData;
use App\Models\WalletTransaction;
use App\Services\Finance\Payment\PaymentGatewayFactory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class VipPackageService
{
    protected $repository;

    public function __construct(VipPackageRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getIndexData(int $userId)
    {
        return [
            'packages' => $this->repository->getActiveSellerPackages(),
            'activeSubscriptions' => $this->repository->getActiveSubscriptionsForUser($userId),
        ];
    }

    public function processBuy(int $userId, BuyVipData $data)
    {
        $package = $this->repository->findSellerPackage($data->packageId);

        if ($data->paymentMethod === 'wallet') {
            $wallet = $this->repository->findWalletByUserId($userId);
            if (!$wallet || $wallet->balance_available < $package->price) {
                throw new \Exception('S? du ví không d? d? mua gói VIP này.');
            }

            $order = $this->repository->createOrder([
                'user_id' => $userId,
                'course_id' => null,
                'vip_package_id' => $package->id,
                'amount_original' => $package->price,
                'amount_paid' => $package->price,
                'commission_rate' => 0,
                'commission_amount' => $package->price,
                'seller_amount' => 0,
                'status' => 'completed',
                'payment_method' => 'wallet',
            ]);

            $wallet->withdraw($package->price, 'Mua gói VIP ' . $package->name, WalletTransaction::TYPE_VIP_PAYMENT);
            $this->activateVip($userId, $package, $order->id);

            return ['type' => 'wallet', 'message' => 'Thanh toán thành công! Gói VIP dã du?c kích ho?t.'];
        }

        $order = $this->repository->createOrder([
            'user_id' => $userId,
            'course_id' => null,
            'vip_package_id' => $package->id,
            'amount_original' => $package->price,
            'amount_paid' => $package->price,
            'commission_rate' => 0,
            'commission_amount' => $package->price,
            'seller_amount' => 0,
            'status' => 'pending',
            'payment_method' => $data->paymentMethod,
        ]);

        $transactionCode = 'VIP_' . strtoupper($data->paymentMethod) . '_' . time() . '_' . Str::random(5);

        $onlinePayment = $this->repository->createOnlinePayment([
            'user_id' => $userId,
            'payment_gateway' => $data->paymentMethod,
            'transaction_code' => $transactionCode,
            'amount' => $package->price,
            'status' => 'pending',
        ]);

        $order->update(['online_payment_id' => $onlinePayment->id]);

        $gateway = PaymentGatewayFactory::create($data->paymentMethod);
        $paymentUrl = $gateway->getPaymentUrl($package->price, $transactionCode);

        session(['vip_return_route' => 'seller.dashboard']);

        return ['type' => 'gateway', 'url' => $paymentUrl];
    }

    private function activateVip(int $userId, $package, int $orderId = null)
    {
        $activeSub = $this->repository->getActiveSubscriptionOfSameType($userId, $package);

        if ($activeSub && $activeSub->vip_package_id == $package->id) {
            $this->repository->extendSubscription($activeSub, $package->duration_days);
            $subscriptionId = $activeSub->id;
        } else {
            if ($activeSub) {
                $this->repository->cancelSubscription($activeSub);
            }

            $newSub = $this->repository->createSubscription([
                'user_id' => $userId,
                'vip_package_id' => $package->id,
                'starts_at' => now(),
                'expires_at' => now()->addDays($package->duration_days),
                'status' => 'active',
            ]);
            $subscriptionId = $newSub->id;
        }

        if ($orderId) {
            $this->repository->updateOrderVipSubscription($orderId, $subscriptionId);
        }
    }
}