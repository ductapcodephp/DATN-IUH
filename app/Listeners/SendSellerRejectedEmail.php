<?php

namespace App\Listeners;

use App\Events\SellerRejected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\SellerApplicationRejected;

class SendSellerRejectedEmail implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SellerRejected $event): void
    {
        Mail::to($event->user->email)->send(new SellerApplicationRejected($event->user, $event->reason));
    }
}
