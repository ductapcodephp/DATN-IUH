<?php

namespace App\Listeners;

use App\Events\ReportDismissed;
use App\Mail\ReportDismissedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendReportDismissedEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct()
    {
        //
    }

    public function handle(ReportDismissed $event): void
    {
        Mail::to($event->reporterEmail)->send(
            new ReportDismissedMail($event->report->target_type_label, $event->report->target_name, $event->reason)
        );
    }
}
