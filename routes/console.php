<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

Schedule::command('payments:cancel-abandoned')->everyMinute();
Schedule::command('seller:release-earnings')->dailyAt('01:00');
Schedule::command('vip:check-expiring')->dailyAt('02:00');
