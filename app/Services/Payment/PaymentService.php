<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\OnlinePayment;
use App\Events\PaymentCompleted;
use App\Models\CourseEnrollment;
use App\Services\Frontend\CartService;
use App\Exceptions\PaymentException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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

        // Kiểm tra xem có khóa học nào đã mua rồi không
        $courseIds = $cartData['cartItems']->pluck('course_id')->toArray();
        $alreadyEnrolled = CourseEnrollment::where('student_id', $userId)
            ->whereIn('course_id', $courseIds)
            ->exists();
            
        if ($alreadyEnrolled) {
            throw new Exception('Trong giỏ hàng có khóa học bạn đã sở hữu.');
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

        // Bọc trong DB Transaction để tránh lỗi lưu nửa vời
        DB::beginTransaction();
        try {
            // Tạo 1 giao dịch tổng (Parent Transaction)
            $onlinePayment = OnlinePayment::create([
                'user_id' => $userId,
                'payment_gateway' => $gatewayName,
                'transaction_code' => $transactionCode,
                'amount' => $totalAmount,
                'status' => 'pending',
            ]);

            $ordersToInsert = [];
            foreach ($cartData['cartItems'] as $item) {
                $discount = $item->price > 0 ? ($item->price / $cartData['totalAmount']) * $discountAmount : 0;
                
                $ordersToInsert[] = [
                    'user_id' => $userId,
                    'course_id' => $item->course_id,
                    'online_payment_id' => $onlinePayment->id,
                    'amount_original' => $item->price,
                    'discount_amount' => $discount,
                    'amount_paid' => $item->price - $discount,
                    'commission_rate' => 30, // mặc định
                    'commission_amount' => 0,
                    'seller_amount' => 0,
                    'status' => 'pending',
                    'payment_method' => $gatewayName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Dùng upsert để tránh lỗi Duplicate entry khi khách bấm thanh toán nhiều lần
            Order::upsert(
                $ordersToInsert,
                ['user_id', 'course_id'], // Unique keys
                [
                    'online_payment_id',
                    'amount_original',
                    'discount_amount',
                    'amount_paid',
                    'status',
                    'payment_method',
                    'updated_at'
                ] // Update if exists
            );
            
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Đã xảy ra lỗi khi tạo đơn hàng: ' . $e->getMessage());
        }

        $gateway = PaymentGatewayFactory::create($gatewayName);
        return $gateway->getPaymentUrl($totalAmount, $transactionCode);
    }

    // 1. DÀNH CHO VNPAY GỌI NGẦM (SERVER-TO-SERVER)
    public function handleGatewayIpn(string $gatewayName, array $callbackData)
    {
        $txnRef = $callbackData['transaction_code'] ?? null;
        if (!$txnRef) {
            throw new PaymentException('Không tìm thấy mã giao dịch gốc.', PaymentException::ORDER_NOT_FOUND);
        }

        // Bọc trong DB Transaction và dùng Pessimistic Locking để chống Race Condition
        return DB::transaction(function () use ($txnRef, $callbackData) {
            /** @var OnlinePayment|null $payment */
            $payment = OnlinePayment::with('orders.course')->where('transaction_code', $txnRef)->lockForUpdate()->first();
            
            if (!$payment) {
                throw new PaymentException('Không tìm thấy giao dịch trong hệ thống.', PaymentException::ORDER_NOT_FOUND);
            }

            if ($payment->status === 'completed') {
                throw new PaymentException('Giao dịch đã được cập nhật.', PaymentException::ORDER_ALREADY_CONFIRMED);
            }

            if ($callbackData['status'] === 'success') {
                $payment->update([
                    'status' => 'completed',
                    'gateway_transaction_id' => $callbackData['gateway_transaction_id'] ?? null,
                    'raw_response' => $callbackData['raw_response'] ?? $callbackData,
                    'paid_at' => now(),
                ]);

                // Xóa giỏ hàng ngay khi IPN thành công
                $this->cartService->clearCart($payment->user_id);

                $enrollmentsToInsert = [];
                foreach ($payment->orders as $order) {
                    $order->update(['status' => 'completed']);
                    
                    if ($order->course_id) {
                        $enrollmentsToInsert[] = [
                            'student_id' => $order->user_id,
                            'course_id' => $order->course_id,
                            'seller_id' => $order->course->seller_id ?? null,
                            'progress' => 0,
                            'is_banned' => false,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
                
                if (!empty($enrollmentsToInsert)) {
                    CourseEnrollment::insertOrIgnore($enrollmentsToInsert);
                }
                
                // Kích hoạt Event bắn vào Queue chạy ngầm
                event(new PaymentCompleted($payment->user_id, $txnRef));
                
                return true;
            } else {
                $payment->update([
                    'status' => 'failed',
                    'raw_response' => $callbackData['raw_response'] ?? $callbackData,
                ]);
                
                foreach ($payment->orders as $order) {
                    $order->update(['status' => 'failed']);
                }
                
                return false;
            }
        });
    }

    // 2. DÀNH CHO USER BROWSER REDIRECT
    public function handleGatewayReturn(string $gatewayName, array $callbackData)
    {
        if (isset($callbackData['status']) && $callbackData['status'] === 'invalid_signature') {
            throw new PaymentException('Chữ ký không hợp lệ.', PaymentException::INVALID_SIGNATURE);
        }

        $txnRef = $callbackData['transaction_code'] ?? null;
        if (!$txnRef) {
            throw new Exception('Không tìm thấy mã giao dịch gốc.');
        }

        /** @var OnlinePayment|null $payment */
        $payment = OnlinePayment::where('transaction_code', $txnRef)->first();
        
        if (!$payment) {
            throw new Exception('Không tìm thấy giao dịch trong hệ thống.');
        }

        // Fallback: Tự động chạy IPN nếu trình duyệt về đích trước
        if ($payment->status === 'pending') {
            try {
                $this->handleGatewayIpn($gatewayName, $callbackData);
            } catch (PaymentException $e) {
                // Bỏ qua lỗi khóa bi quan hoặc đã cập nhật
            } catch (Exception $e) {
                // Ignore
            }
        }

        $payment->refresh();

        if ($payment->status === 'completed') {
            // Xóa session giảm giá trên trình duyệt
            session()->forget('applied_coupons');
            return true; // Success
        }

        return false; // Failed
    }
}
