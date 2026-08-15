<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseAd;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetDailyAds extends Command
{
    /**
     *
     * @var string
     */
    protected $signature = 'ads:reset-daily';

    /**
     *
     * @var string
     */
    protected $description = 'Reset spent_today for all ads and reactivate out of budget ads';

    /**
     */
    public function handle()
    {
        $this->info('Starting to reset daily ads budget...');

        $today = Carbon::today()->toDateString();

        // Bước 1: Đánh dấu các quảng cáo đã hết hạn (end_date < hôm nay)
        $expired = CourseAd::where('end_date', '<', $today)
            ->whereNotNull('end_date')
            ->where('status', '!=', 'expired')
            ->where('status', '!=', 'paused')
            ->update(['status' => 'expired']);

        $this->info("Marked {$expired} ad campaigns as expired (past end_date).");

        // Bước 2: Reset spent_today và cập nhật status cho các quảng cáo còn hạn hoặc không set ngày
        $updated = CourseAd::query()->update([
            'spent_today' => 0,
            'status' => DB::raw("
                CASE
                    WHEN status = 'paused' THEN 'paused'
                    WHEN status = 'expired' THEN 'expired'
                    WHEN end_date IS NOT NULL AND end_date < '{$today}' THEN 'expired'
                    WHEN start_date IS NOT NULL AND start_date > '{$today}' THEN 'paused'
                    WHEN campaign_balance > 0 THEN 'active'
                    ELSE 'out_of_budget'
                END
            ")
        ]);

        $this->info("Successfully reset spent_today for {$updated} ad campaigns.");
    }
}
