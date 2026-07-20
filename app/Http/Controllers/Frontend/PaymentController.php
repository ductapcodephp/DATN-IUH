<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Payment\PaymentService;
use App\Services\Payment\PaymentGatewayFactory;
use App\DTO\Payment\CheckoutData;
use App\DTO\Payment\IpnData;
use App\Exceptions\PaymentException;
use Illuminate\Support\Facades\Auth;
use Exception;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function process(Request $request)
    {
        try {
            $dto = CheckoutData::fromRequest($request, Auth::id());
            $paymentUrl = $this->paymentService->processCheckout($dto);
            return Inertia::location($paymentUrl);
        } catch (Exception $e) {
            return redirect()->route('frontend.cart.index')->with('error', $e->getMessage());
        }
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'gateway' => 'required|string|in:vnpay,stripe'
        ]);

        try {
            $userId = Auth::id();
            $gatewayName = $request->input('gateway');
            $amount = (float) $request->input('amount');
            $transactionCode = 'DEP_' . strtoupper($gatewayName) . '_' . time() . '_' . \Illuminate\Support\Str::random(5);

            \App\Models\OnlinePayment::create([
                'user_id' => $userId,
                'payment_gateway' => $gatewayName,
                'transaction_code' => $transactionCode,
                'amount' => $amount,
                'status' => 'pending',
            ]);

            $gateway = PaymentGatewayFactory::create($gatewayName);
            $paymentUrl = $gateway->getPaymentUrl($amount, $transactionCode);

            return Inertia::location($paymentUrl);
        } catch (Exception $e) {
            return redirect()->route('dashboard.wallet')->with('error', 'Lỗi khi tạo giao dịch nạp tiền: ' . $e->getMessage());
        }
    }

    public function retry(Request $request, $id)
    {
        try {
            $payment = \App\Models\OnlinePayment::where('user_id', Auth::id())
                ->where('id', $id)
                ->whereIn('status', ['failed', 'pending'])
                ->firstOrFail();

            // Tạo mã transaction mới để tránh bị trùng lặp VNPAY request
            $prefix = str_starts_with($payment->transaction_code, 'DEP_') ? 'DEP_' : 'ORD_';
            $newTransactionCode = $prefix . strtoupper($payment->payment_gateway) . '_' . time() . '_' . \Illuminate\Support\Str::random(5);
            
            $payment->update([
                'transaction_code' => $newTransactionCode,
                'status' => 'pending',
            ]);

            $gateway = PaymentGatewayFactory::create($payment->payment_gateway);
            $paymentUrl = $gateway->getPaymentUrl($payment->amount, $newTransactionCode);

            return Inertia::location($paymentUrl);
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Không thể thanh toán lại giao dịch này: ' . $e->getMessage());
        }
    }

    public function gatewayReturn(Request $request, $gatewayName)
    {
        
        try {
            $gateway = PaymentGatewayFactory::create($gatewayName);
            $callbackData = $gateway->handleCallback($request);
            
            $isSuccess = $this->paymentService->handleGatewayReturn($gatewayName, $callbackData);

            if ($isSuccess) {
                if (str_starts_with($callbackData['transaction_code'] ?? '', 'DEP_')) {
                    return redirect()->route('dashboard.wallet')->with('success', 'Nạp tiền vào ví thành công!');
                }
                return redirect()->route('frontend.home')->with('success', 'Thanh toán thành công. Khóa học đã được thêm vào tài khoản của bạn!');
            } else {
                if (str_starts_with($callbackData['transaction_code'] ?? '', 'DEP_')) {
                    return redirect()->route('dashboard.wallet')->with('error', 'Thanh toán thất bại hoặc đã bị hủy.');
                }
                return redirect()->route('frontend.cart.index')->with('error', 'Thanh toán thất bại hoặc đã bị hủy.');
            }
        } catch (Exception $e) {
            $txnCode = $callbackData['transaction_code'] ?? $request->vnp_TxnRef ?? '';
            $isDeposit = str_starts_with($txnCode, 'DEP_');
            
            if ($isDeposit) {
                return redirect()->route('dashboard.wallet')->with('error', $e->getMessage());
            }
            return redirect()->route('frontend.cart.index')->with('error', $e->getMessage());
        }
    }

    public function gatewayIpn(Request $request, $gatewayName)
    {
        try {
            $gateway = PaymentGatewayFactory::create($gatewayName);
            $callbackData = $gateway->handleCallback($request);
            
            if ($callbackData['status'] === 'invalid_signature') {
                return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
            }

            $ipnDto = IpnData::fromCallback($callbackData);
            $this->paymentService->handleGatewayIpn($gatewayName, $ipnDto);

            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        } catch (PaymentException $e) {
            return response()->json(['RspCode' => $e->getErrorCode(), 'Message' => $e->getMessage()]);
        } catch (Exception $e) {
            return response()->json(['RspCode' => '99', 'Message' => 'Unknown error']);
        }
    }
}
