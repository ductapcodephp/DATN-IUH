<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\OnlinePayment;
use App\Models\CourseEnrollment;
use App\Services\Frontend\CartService;
use Illuminate\Support\Str;
use Exception;

class PaymentService
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function processCheckout(int $userId, string $gatewayName): string
    {
        $cartData = $this->cartService->getCartDataForUser($userId);
        
        if ($cartData['cartItems']->isEmpty()) {
            throw new Exception('Giỏ hàng trống.');
        }

        $appliedCoupons = session('applied_coupons', []);
        $discountAmount = 0;
        
        if (!empty($appliedCoupons)) {
            try {
                $discountResult = $this->cartService->calculateDiscountForCart($cartData['cartItems'], $appliedCoupons);
                $discountAmount = $discountResult['discountAmount'];
            } catch (Exception $e) {
                // Ignore
            }
        }

        $totalAmount = $cartData['totalAmount'] - $discountAmount;
        
        if ($totalAmount <= 0) {
            throw new Exception('Số tiền thanh toán không hợp lệ.');
        }

        $transactionCode = strtoupper($gatewayName) . '_' . time() . '_' . Str::random(5);

        $index = 1;
        foreach ($cartData['cartItems'] as $item) {
            $discount = $item->price > 0 ? ($item->price / $cartData['totalAmount']) * $discountAmount : 0;
            
            $order = Order::updateOrCreate(
                [
                    'user_id' => $userId,
                    'course_id' => $item->course_id,
                ],
                [
                    'amount_original' => $item->price,
                    'discount_amount' => $discount,
                    'amount_paid' => $item->price - $discount,
                    'commission_rate' => 30, // mặc định
                    'commission_amount' => 0,
                    'seller_amount' => 0,
                    'status' => 'pending',
                    'payment_method' => $gatewayName,
                ]
            );

            OnlinePayment::updateOrCreate(
                [
                    'user_id' => $userId,
                    'order_id' => $order->id,
                    'status' => 'pending',
                ],
                [
                    'payment_gateway' => $gatewayName,
                    'transaction_code' => $transactionCode . '-' . $index,
                    'amount' => $order->amount_paid,
                ]
            );
            
            $index++;
        }

        $gateway = PaymentGatewayFactory::create($gatewayName);
        return $gateway->getPaymentUrl($totalAmount, $transactionCode);
    }

    public function handleGatewayReturn(string $gatewayName, array $callbackData)
    {
        if ($callbackData['status'] === 'invalid_signature') {
            throw new Exception('Chữ ký không hợp lệ.');
        }

        $txnRef = $callbackData['transaction_code'];
        if (!$txnRef) {
            throw new Exception('Không tìm thấy mã giao dịch gốc.');
        }

        $payments = OnlinePayment::where('transaction_code', 'LIKE', $txnRef . '-%')->get();
        
        if ($payments->isEmpty()) {
            throw new Exception('Không tìm thấy giao dịch trong hệ thống.');
        }

        if ($callbackData['status'] === 'success') {
            foreach ($payments as $payment) {
                if ($payment->status !== 'completed') {
                    $payment->update([
                        'status' => 'completed',
                        'gateway_transaction_id' => $callbackData['gateway_transaction_id'],
                        'raw_response' => $callbackData['raw_response'],
                        'paid_at' => now(),
                    ]);

                    $order = $payment->order;
                    $order->update(['status' => 'completed']);
                    
                    CourseEnrollment::firstOrCreate([
                        'user_id' => $order->user_id,
                        'course_id' => $order->course_id,
                    ], [
                        'enrolled_at' => now(),
                    ]);
                }
            }
            
            $userId = $payments->first()->user_id;
            $this->cartService->clearCart($userId);
            session()->forget('applied_coupons');
            
            return true; // Success
        } else {
            foreach ($payments as $payment) {
                $payment->update([
                    'status' => 'failed',
                    'raw_response' => $callbackData['raw_response'],
                ]);
                $payment->order->update(['status' => 'failed']);
            }
            
            return false; // Failed
        }
    }
}
