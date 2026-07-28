<?php

namespace App\Services\Finance\Payment\Pipes\Ipn;

use Carbon\Carbon;
use App\DTO\Payment\IpnData;
use App\Events\PaymentCompleted;
use App\Models\CourseEnrollment;
use App\Models\DailyStatistic;
use App\Models\SystemWallet;
use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Models\Wallet;
use App\Notifications\Seller\NewCourseEnrollmentNotification;
use App\Services\Frontend\CartService;
use Closure;

class CompleteOrderPayment
{
    public function __construct(protected CartService $cartService) {}

    /**
     * Xử lý khi thanh toán đơn hàng/mua khóa học thành công
     */
    public function handle(IpnData $data, Closure $next)
    {
        // Bỏ qua nếu không phải giao dịch thành công hoặc LÀ giao dịch NẠP TIỀN
        if ($data->callbackData['status'] !== 'success' || str_starts_with($data->transactionCode, 'DEP_')) {
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

        // Cập nhật trạng thái từng order + tạo enrollment
        $enrollmentsToInsert = [];
        foreach ($payment->orders as $order) {
            $order->update(['status' => 'completed']);

            // (SIMULATION) Mô phỏng tài khoản Vietcombank của công ty nhận được 100% tiền khách trả
            SystemWallet::getInstance()->addTransaction((float) $order->amount_paid, 'in', 'Order', $order->id, 'Tiền khách mua khóa học #'.$order->id);

            // Cộng tiền vào ví pending của seller (đã trừ hoa hồng platform)
            if ($order->course_id && $order->course->seller_id) {
                $sellerId = $order->course->seller_id;

                $sellerWallet = Wallet::firstOrCreate(
                    ['user_id' => $sellerId],
                    ['balance' => 0, 'balance_available' => 0, 'balance_pending' => 0]
                );

                $sellerWallet->addPendingEarning(
                    (float) $order->seller_amount,
                    $order->id,
                    'Thu nhập chờ giải phóng từ đơn hàng #'.$order->id
                );

                // Update Daily Statistic
                DailyStatistic::updateOrCreate(
                    [
                        'seller_id' => $sellerId,
                        'date' => now()->toDateString(),
                    ],
                    [] // The values are handled by increment/decrement below, but we need to ensure the record exists first.
                )->increment('total_revenue', (float) $order->seller_amount);

                DailyStatistic::where('seller_id', $sellerId)
                    ->where('date', now()->toDateString())
                    ->increment('total_orders');
            }

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

                // Gửi thông báo cho seller
                if ($order->course && $order->course->seller) {
                    $order->course->seller->notify(new NewCourseEnrollmentNotification(
                        $order->course->title,
                        $order->user->name,
                        $order->course->id
                    ));
                }
            }

            // Tạo VIP Subscription nếu là mua gói VIP
            if ($order->vip_package_id) {
                $package = VipPackage::find($order->vip_package_id);
                if ($package) {
                    $query = VipSubscription::where('user_id', $order->user_id)
                        ->whereHas('vipPackage', fn ($q) => $q->where('role_type', $package->role_type));
                        
                    if ($package->role_type === 'seller') {
                        $query->whereHas('vipPackage', fn ($q) => $q->where('package_type', $package->package_type));
                    }
                    
                    $activeSub = $query->active()->first();

                    if ($activeSub && $activeSub->vip_package_id == $package->id) {
                        $activeSub->update([
                            'expires_at' => Carbon::parse($activeSub->expires_at)->addDays($package->duration_days),
                        ]);
                        $order->update(['vip_subscription_id' => $activeSub->id]);
                    } else {
                        if ($activeSub) {
                            $activeSub->update(['status' => 'cancelled']);
                        }

                        $newSub = VipSubscription::create([
                            'user_id' => $order->user_id,
                            'vip_package_id' => $package->id,
                            'starts_at' => now(),
                            'expires_at' => now()->addDays($package->duration_days),
                            'status' => 'active',
                        ]);
                        $order->update(['vip_subscription_id' => $newSub->id]);
                    }
                }
            }
        }

        // Bulk insert enrollments
        if (! empty($enrollmentsToInsert)) {
            CourseEnrollment::insertOrIgnore($enrollmentsToInsert);
        }

        // Phát sự kiện thanh toán hoàn tất
        event(new PaymentCompleted($payment->user_id, $data->transactionCode));

        $data->isSuccess = true;

        return $next($data);
    }
}
