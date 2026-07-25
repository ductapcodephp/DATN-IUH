<?php

namespace App\Events;

use App\Models\Report;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportDismissed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $report;
    public $reporterEmail;
    public $reason;

    public function __construct(Report $report, $reporterEmail, $reason)
    {
        $this->report = $report;
        $this->reporterEmail = $reporterEmail;
        $this->reason = $reason;
    }
}
