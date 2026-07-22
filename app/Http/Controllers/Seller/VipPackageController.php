<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Models\Order;
use App\Services\Finance\Payment\VNPayService;
use Illuminate\Support\Facades\Auth;

class VipPackageController extends Controller
{
    public function index()
    {
        $packages = VipPackage::active()->ordered()->get();
        
        $user = Auth::user();
        $currentSubscription = VipSubscription::with('vipPackage')
            ->where('user_id', $user->id)
            ->active()
            ->first();

        return Inertia::render('Seller/VipPackages/Index', [
            'packages' => $packages,
            'currentSubscription' => $currentSubscription,
        ]);
    }

    public function buy(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:vip_packages,id',
            'payment_method' => 'required|in:vnpay,stripe,wallet'
        ]);

        $package = VipPackage::findOrFail($request->package_id);
        $user = Auth::user();

        // Thanh toán bằng ví điện tử
        if ($request->payment_method === 'wallet') {
            $wallet = \App\Models\Wallet::where('user_id', $user->id)->first();
            if (!$wallet || $wallet->balance_available < $package->price) {
                return back()->with('error', 'Số dư ví không đủ để mua gói VIP này.');
            }
            
            // Trừ tiền ví
            $wallet->withdraw($package->price, 'Mua gói VIP ' . $package->name, \App\Models\WalletTransaction::TYPE_VIP_PAYMENT);
            
            // Kích hoạt VIP ngay lập tức
            $this->activateVip($user->id, $package);
            
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
            'payment_method' => $request->payment_method
        ]);

        $transactionCode = 'VIP_' . strtoupper($request->payment_method) . '_' . time() . '_' . \Illuminate\Support\Str::random(5);
        
        $onlinePayment = \App\Models\OnlinePayment::create([
            'user_id' => $user->id,
            'payment_gateway' => $request->payment_method,
            'transaction_code' => $transactionCode,
            'amount' => $package->price,
            'status' => 'pending',
        ]);
        
        // Liên kết order với online payment
        $order->update(['online_payment_id' => $onlinePayment->id]);

        $gateway = \App\Services\Finance\Payment\PaymentGatewayFactory::create($request->payment_method);
        $paymentUrl = $gateway->getPaymentUrl($package->price, $transactionCode);

        // Lưu return_route để IPN hoặc gatewayReturn biết đường về (dùng cho VNPAY/Stripe)
        session(['vip_return_route' => 'seller.dashboard']); // or whatever page they were on

        return Inertia::location($paymentUrl);
    }
    
    private function activateVip($userId, $package, $orderId = null)
    {
        // Deactivate old active subscriptions
        VipSubscription::where('user_id', $userId)->active()->update(['status' => 'cancelled']);
        
        VipSubscription::create([
            'user_id' => $userId,
            'vip_package_id' => $package->id,
            'order_id' => $orderId,
            'starts_at' => now(),
            'expires_at' => now()->addDays($package->duration_days),
            'status' => 'active',
        ]);
    }
}
