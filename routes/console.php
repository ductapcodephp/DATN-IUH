<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

// Mỗi phút gọi command hủy các đơn bỏ hoang (tránh lỗi cache code cũ của schedule:work)
Schedule::command('payments:cancel-abandoned')->everyMinute();
