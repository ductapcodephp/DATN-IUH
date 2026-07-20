<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\Wallet;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SetupUserWallet
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }


    public function handle(Login $event): void
    {
       
        Wallet::firstOrCreate(
            ['user_id' => $event->user->id],
            ['balance' => 0]
        );
    }
}
