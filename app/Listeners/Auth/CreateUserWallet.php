<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserRegistered;

class CreateUserWallet
{
    public function handle(UserRegistered $event): void
    {
        // $event->user chính là thực thể User truyền từ Event qua
        $event->user->wallet()->create([
            'balance' => 0,
        ]);
    }
}
