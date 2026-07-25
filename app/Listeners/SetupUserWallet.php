<?php

namespace App\Listeners;

use App\Models\Wallet;
use Illuminate\Auth\Events\Login;

class SetupUserWallet
{
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
