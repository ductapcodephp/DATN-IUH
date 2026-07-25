<?php

namespace App\Events;

use App\Models\Report;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportResolved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $report;
    public $ownerEmail;
    public $reason;

    public function __construct(Report $report, $ownerEmail, $reason = null)
    {
        $this->report = $report;
        $this->ownerEmail = $ownerEmail;
        $this->reason = $reason;
    }
}
