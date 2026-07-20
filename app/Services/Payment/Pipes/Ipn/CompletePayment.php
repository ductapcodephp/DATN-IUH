<?php

namespace App\Services\Payment\Pipes\Ipn;

use App\DTO\Payment\IpnData;
use App\Services\Frontend\CartService;
use App\Models\CourseEnrollment;
use App\Models\CouponUsage;
use App\Events\PaymentCompleted;
use Closure;

class CompletePayment
{
    public function __construct(protected CartService $cartService) {}

    /**
     * Xử lý khi thanh toán thành công:
     * cập nhật trạng thái payment/orders, xóa giỏ hàng,
     * tạo enrollment, ghi nhận coupon usage, và phát sự kiện.
     */
    public function handle(IpnData $data, Closure $next)
    {
        if ($data->callbackData['status'] !== 'success') {
            return $next($data);
        }

        $payment = $data->payment;

        // Cập nhật trạng thái thanh toán
        $payment->update([
            'status' => 'completed',
            'gateway_transaction_id' => $data->callbackData['gateway_transaction_id'] ?? null,
            'raw_response' => $data->callbackData['raw_response'] ?? $data->callbackData,
            'paid_at' => now(),
        ]);

        // Xóa giỏ hàng
        $this->cartService->clearCart($payment->user_id);

        // Cập nhật trạng thái từng order + tạo enrollment + ghi nhận coupon
        $enrollmentsToInsert = [];
        foreach ($payment->orders as $order) {
            $order->update(['status' => 'completed']);

            // Chuẩn bị dữ liệu enrollment
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

        // Bulk insert enrollments
        if (!empty($enrollmentsToInsert)) {
            CourseEnrollment::insertOrIgnore($enrollmentsToInsert);
        }

        // Phát sự kiện thanh toán hoàn tất
        event(new PaymentCompleted($payment->user_id, $data->transactionCode));

        $data->isSuccess = true;

        return $next($data);
    }
}
