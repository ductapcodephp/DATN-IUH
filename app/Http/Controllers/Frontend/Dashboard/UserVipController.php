<?php

namespace App\Http\Controllers\Frontend\Dashboard;

use Carbon\Carbon;

use App\Http\Controllers\Controller;
use App\Models\OnlinePayment;
use App\Models\Order;
use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\Finance\Payment\PaymentGatewayFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserVipController extends Controller
{
    public function index()
    {
        $packages = VipPackage::active()->forRole('user')->ordered()->get();

        $user = Auth::user();
        $currentSubscription = VipSubscription::with('vipPackage')
            ->where('user_id', $user->id)
            ->active()
            ->first();

        return Inertia::render('Frontend/Dashboard/VipPackages/Index', [
            'packages' => $packages,
            'currentSubscription' => $currentSubscription,
        ]);
    }

    public function buy(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:vip_packages,id',
            'payment_method' => 'required|in:vnpay,stripe,wallet',
        ]);

        $package = VipPackage::forRole('user')->findOrFail($request->package_id);
        $user = Auth::user();

        // Thanh toán bằng ví điện tử
        if ($request->payment_method === 'wallet') {
            $wallet = Wallet::where('user_id', $user->id)->first();
            if (! $wallet || $wallet->balance_available < $package->price) {
                return back()->with('error', 'Số dư ví không đủ để mua gói VIP này.');
            }

            // Tạo order cho ví
            $order = Order::create([
                'user_id' => $user->id,
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

            // Trừ tiền ví
            $wallet->withdraw($package->price, 'Mua gói VIP '.$package->name, WalletTransaction::TYPE_VIP_PAYMENT);

            // Kích hoạt VIP ngay lập tức
            $this->activateVip($user->id, $package, $order->id);

            return back()->with('success', 'Thanh toán thành công! Gói VIP đã được kích hoạt.');
        }

        // Tạo order
        $order = Order::create([
            'user_id' => $user->id,
            'course_id' => null,
            'vip_package_id' => $package->id,
            'amount_original' => $package->price,
            'amount_paid' => $package->price,
            'commission_rate' => 0,
            'commission_amount' => $package->price,
            'seller_amount' => 0,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        $transactionCode = 'VIP_'.strtoupper($request->payment_method).'_'.time().'_'.Str::random(5);

        $onlinePayment = OnlinePayment::create([
            'user_id' => $user->id,
            'payment_gateway' => $request->payment_method,
            'transaction_code' => $transactionCode,
            'amount' => $package->price,
            'status' => 'pending',
        ]);

        // Liên kết order với online payment
        $order->update(['online_payment_id' => $onlinePayment->id]);

        $gateway = PaymentGatewayFactory::create($request->payment_method);
        $paymentUrl = $gateway->getPaymentUrl($package->price, $transactionCode);

        session(['vip_return_route' => 'dashboard.vip.index']);

        return Inertia::location($paymentUrl);
    }

    private function activateVip($userId, $package, $orderId = null)
    {
        $activeSub = VipSubscription::where('user_id', $userId)
            ->whereHas('vipPackage', fn ($q) => $q->where('role_type', 'user'))
            ->active()->first();

        if ($activeSub && $activeSub->vip_package_id == $package->id) {
            // Gia hạn gói hiện tại
            $activeSub->update([
                'expires_at' => Carbon::parse($activeSub->expires_at)->addDays($package->duration_days),
            ]);
            $subscriptionId = $activeSub->id;
        } else {
            // Hủy gói cũ khác loại
            if ($activeSub) {
                $activeSub->update(['status' => 'cancelled']);
            }

            $newSub = VipSubscription::create([
                'user_id' => $userId,
                'vip_package_id' => $package->id,
                'starts_at' => now(),
                'expires_at' => now()->addDays($package->duration_days),
                'status' => 'active',
            ]);
            $subscriptionId = $newSub->id;
        }

        if ($orderId) {
            Order::where('id', $orderId)->update(['vip_subscription_id' => $subscriptionId]);
        }
    }
}
