<?php

namespace App\Listeners;

use App\Events\SellerApplied;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\SellerApplicationReceived;

class SendSellerAppliedEmail implements ShouldQueue
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
    public function handle(SellerApplied $event): void
    {
        Mail::to($event->user->email)->send(new SellerApplicationReceived($event->user));
    }
}
