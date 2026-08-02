<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseAd;
use Illuminate\Support\Facades\DB;

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

        $updated = CourseAd::query()->update([
            'spent_today' => 0,
            'status' => DB::raw("IF(status = 'paused', 'paused', IF(campaign_balance > 0, 'active', 'out_of_budget'))")
        ]);

        $this->info("Successfully reset spent_today for {$updated} ad campaigns.");
    }
}
