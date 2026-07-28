<?php

namespace App\Listeners;

use App\Events\SellerApproved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\SellerApplicationApproved;

class SendSellerApprovedEmail implements ShouldQueue
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
    public function handle(SellerApproved $event): void
    {
        Mail::to($event->user->email)->send(new SellerApplicationApproved($event->user));
    }
}
