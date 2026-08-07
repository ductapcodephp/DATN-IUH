<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Coupon;

class ExpireCoupons extends Command
{
    /**
     *
     * @var string
     */
    protected $signature = 'coupons:expire';

    /**
     *
     * @var string
     */
    protected $description = 'Hủy kích hoạt các mã giảm giá đã quá hạn';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Đang kiểm tra các mã giảm giá hết hạn...');

        $updated = Coupon::where('is_active', true)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->update(['is_active' => false]);

        $this->info("Đã hủy kích hoạt thành công {$updated} mã giảm giá hết hạn.");
    }
}
