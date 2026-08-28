<?php

use App\Models\SystemSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Schema;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Load dynamic settings from Redis Cache (fallback DB) to minimize MySQL hits
$cronSettings = [];
try {
    if (Schema::hasTable('system_settings')) {
        $cronSettings = Cache::remember('system_settings_all', 300, function () {
            return SystemSetting::pluck('value', 'key')->toArray();
        });
    }
} catch (\Throwable $e) {
    $cronSettings = [];
}

// Helper function to safely apply dynamic frequency / time to a scheduled command
$scheduleCommand = function (string $command, string $settingPrefix, array $defaults) use ($cronSettings) {
    try {
        $enabled = $cronSettings["{$settingPrefix}_enabled"] ?? $defaults['enabled'];
        if ($enabled === '0' || $enabled === false) {
            return; // Đã bị Admin tắt
        }

        $type = $defaults['type']; // 'daily' or 'frequency'
        $event = Schedule::command($command);

        if ($type === 'daily') {
            $time = $cronSettings["{$settingPrefix}_time"] ?? $defaults['time'];
            $time = trim((string) $time);
            if (preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $time)) {
                $event->dailyAt($time);
            } else {
                $event->dailyAt($defaults['time']);
            }
        } elseif ($type === 'frequency') {
            $freq = $cronSettings["{$settingPrefix}_freq"] ?? $defaults['freq'];
            match ($freq) {
                'everyMinute' => $event->everyMinute(),
                'everyTwoMinutes' => $event->everyTwoMinutes(),
                'everyThreeMinutes' => $event->everyThreeMinutes(),
                'everyFourMinutes' => $event->everyFourMinutes(),
                'everyFiveMinutes' => $event->everyFiveMinutes(),
                'everyTenMinutes' => $event->everyTenMinutes(),
                'everyFifteenMinutes' => $event->everyFifteenMinutes(),
                'everyThirtyMinutes' => $event->everyThirtyMinutes(),
                'hourly' => $event->hourly(),
                'everyTwoHours' => $event->everyTwoHours(),
                'everyThreeHours' => $event->everyThreeHours(),
                'everyFourHours' => $event->everyFourHours(),
                'everySixHours' => $event->everySixHours(),
                'daily' => $event->daily(),
                default => $event->{$defaults['freq']}(),
            };
        }
    } catch (\Throwable $e) {
        if ($defaults['type'] === 'daily') {
            Schedule::command($command)->dailyAt($defaults['time']);
        } elseif ($defaults['type'] === 'frequency') {
            $freq = $defaults['freq'];
            Schedule::command($command)->$freq();
        }
    }
};

// 1. Tự động hủy đơn hàng/giao dịch thanh toán treo
$scheduleCommand('payments:cancel-abandoned', 'cron_payments_cancel', [
    'enabled' => '1',
    'type' => 'frequency',
    'freq' => 'everyMinute',
]);

// 2. Giải phóng thu nhập (pending -> available) cho Seller sau thời gian giam
$scheduleCommand('seller:release-earnings', 'cron_seller_release', [
    'enabled' => '1',
    'type' => 'daily',
    'time' => '01:00',
]);

// 3. Kiểm tra và gửi thông báo gia hạn gói VIP
$scheduleCommand('vip:check-expiring', 'cron_vip_check', [
    'enabled' => '1',
    'type' => 'daily',
    'time' => '02:00',
]);

// 4. Reset số tiền chi tiêu quảng cáo trong ngày
$scheduleCommand('ads:reset-daily', 'cron_ads_reset', [
    'enabled' => '1',
    'type' => 'daily',
    'time' => '00:00',
]);

// 5. Tự động vô hiệu hóa mã giảm giá (coupon) đã hết hạn
$scheduleCommand('coupons:expire', 'cron_coupons_expire', [
    'enabled' => '1',
    'type' => 'daily',
    'time' => '00:00',
]);

// 6. Đồng bộ tiến độ xem video từ Redis về Database
$scheduleCommand('video-progress:sync', 'cron_video_progress_sync', [
    'enabled' => '1',
    'type' => 'frequency',
    'freq' => 'everyFiveMinutes',
]);

// 7. Tự động phát mã giảm giá hàng tháng cho Học Viên VIP
$scheduleCommand('vip:distribute-coupons', 'cron_vip_distribute_coupons', [
    'enabled' => '1',
    'type' => 'daily',
    'time' => '03:00',
]);
