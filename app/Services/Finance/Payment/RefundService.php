<?php

namespace App\Services\Finance\Payment;

use Exception;
use App\Models\CourseEnrollment;
use App\Models\CourseProgress;
use App\Models\Order;
use App\Models\SystemWallet;
use App\Models\User;
use App\Models\WalletTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RefundService
{
    /**
     * Tỷ lệ học tối đa cho phép hoàn tiền (15%)
     */
    public const MAX_PROGRESS_PERCENTAGE_FOR_REFUND = 0.15;

    /**
     * Thời hạn hoàn tiền (3 ngày)
     */
    public const MAX_REFUND_DAYS = 3;

    /**
     * Số lần hoàn tiền tối đa trong 1 tháng
     */
    public const MAX_REFUNDS_PER_MONTH = 3;

    /**
     * Kiểm tra xem học viên có đủ điều kiện yêu cầu hoàn tiền cho đơn hàng này hay không.
     * Áp dụng 3 quy tắc:
     * 1. Thời hạn hoàn tiền (3 ngày)
     * 2. Tiến độ học < 15%
     * 3. Chống lạm dụng (tối đa 3 lần / tháng)
     *
     * @return array [ 'status' => bool, 'message' => string ]
     */
    public function checkRefundEligibility(Order $order, User $user): array
    {
        // 1. Kiểm tra đơn hàng có hợp lệ không
        if ($order->user_id !== $user->id) {
            return ['status' => false, 'message' => 'Bạn không có quyền thao tác trên đơn hàng này.'];
        }

        if ($order->status !== 'completed') {
            return ['status' => false, 'message' => 'Chỉ có thể hoàn tiền đơn hàng đã thanh toán thành công.'];
        }

        if ($order->isRefunded()) {
            return ['status' => false, 'message' => 'Đơn hàng này đã được hoàn tiền.'];
        }

        // 2. Kiểm tra thời hạn 3 ngày
        if ($order->created_at->diffInDays(now()) > self::MAX_REFUND_DAYS) {
            return ['status' => false, 'message' => 'Đơn hàng đã vượt quá thời hạn hoàn tiền ('.self::MAX_REFUND_DAYS.' ngày).'];
        }

        // 3. Kiểm tra tiến độ học tập dựa vào bảng course_progress
        $course = $order->course;
        if ($course && $course->total_duration_seconds > 0) {
            $totalWatchedSeconds = CourseProgress::where('course_id', $course->id)
                ->where('user_id', $user->id)
                ->sum('watched_seconds');

            $progressPercentage = $totalWatchedSeconds / $course->total_duration_seconds;

            if ($progressPercentage > self::MAX_PROGRESS_PERCENTAGE_FOR_REFUND) {
                return [
                    'status' => false,
                    'message' => 'Bạn đã học quá '.(self::MAX_PROGRESS_PERCENTAGE_FOR_REFUND * 100).'% nội dung khóa học. Yêu cầu hoàn tiền bị từ chối.',
                ];
            }
        }

        // 4. Kiểm tra lịch sử lạm dụng (Tối đa 3 lần / tháng)
        $refundsThisMonth = Order::where('user_id', $user->id)
            ->where('status', 'refunded')
            ->where('updated_at', '>=', Carbon::now()->startOfMonth())
            ->count();

        if ($refundsThisMonth >= self::MAX_REFUNDS_PER_MONTH) {
            return [
                'status' => false,
                'message' => 'Bạn đã đạt giới hạn yêu cầu hoàn tiền trong tháng này ('.self::MAX_REFUNDS_PER_MONTH.' lần). Lạm dụng chính sách hoàn tiền có thể dẫn đến khóa tài khoản vĩnh viễn.',
            ];
        }

        // Đủ điều kiện
        return ['status' => true, 'message' => 'Đủ điều kiện hoàn tiền.'];
    }

    /**
     * Thực thi hoàn tiền (Giả lập logic, sếp sẽ nhúng vào Controller)
     */
    public function processRefund(Order $order, User $user)
    {
        $eligibility = $this->checkRefundEligibility($order, $user);
        if (! $eligibility['status']) {
            throw new Exception($eligibility['message']);
        }

        return DB::transaction(function () use ($order, $user) {
            // Cập nhật trạng thái đơn hàng
            $order->update([
                'status' => 'refunded',
                'updated_at' => now(),
            ]);

            // Hủy Course Enrollment
            CourseEnrollment::where('course_id', $order->course_id)
                ->where('student_id', $user->id)
                ->update(['is_banned' => true]);

            // Gọi API Cổng Thanh Toán (VNPAY / Stripe) để refund tiền về thẻ cho khách (nếu có)
            // Hoặc cộng lại tiền vào ví cho Student:
            if ($user->wallet) {
                $user->wallet->addTransaction(
                    WalletTransaction::TYPE_REFUND,
                    $order->amount_paid,
                    'Hoàn tiền khóa học '.($order->course->title ?? ('#'.$order->course_id)),
                    WalletTransaction::STATUS_COMPLETED,
                    'REFUND_'.$order->id
                );
            } else {
                throw new Exception('Không tìm thấy ví của học viên để hoàn tiền.');
            }

            // Trừ tiền khỏi ví hệ thống (do đã hoàn lại cho khách)
            SystemWallet::getInstance()->addTransaction(
                (float) $order->amount_paid,
                'out',
                'Order',
                $order->id,
                'Hoàn tiền cho khách hàng khóa học #'.$order->id
            );

            return true;
        });
    }
}
