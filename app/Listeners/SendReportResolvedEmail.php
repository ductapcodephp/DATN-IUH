<?php

namespace App\Listeners;

use App\Events\ReportResolved;
use App\Mail\ReportResolvedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendReportResolvedEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct()
    {
        //
    }

    public function handle(ReportResolved $event): void
    {
        Mail::to($event->ownerEmail)->send(
            new ReportResolvedMail($event->report->target_type_label, $event->report->target_name, $event->reason)
        );
    }
}
