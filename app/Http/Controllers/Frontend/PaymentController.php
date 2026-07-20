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

    public function gatewayReturn(Request $request, $gatewayName)
    {
        
        try {
            $gateway = PaymentGatewayFactory::create($gatewayName);
            $callbackData = $gateway->handleCallback($request);
            
            $isSuccess = $this->paymentService->handleGatewayReturn($gatewayName, $callbackData);

            if ($isSuccess) {
                return redirect()->route('frontend.home')->with('success', 'Thanh toán thành công. Khóa học đã được thêm vào tài khoản của bạn!');
            } else {
                return redirect()->route('frontend.cart.index')->with('error', 'Thanh toán thất bại hoặc đã bị hủy.');
            }
        } catch (Exception $e) {
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
