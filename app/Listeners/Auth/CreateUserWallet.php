<?php

namespace App\Listeners\Auth;

use App\Enums\UserRole;
use App\Events\Auth\UserRegistered;

class CreateUserWallet
{
    public function handle(UserRegistered $event): void
    {
        if ($event->user->current_role === UserRole::SELLER || $event->user->current_role === UserRole::ADMIN || in_array(UserRole::SELLER->value, $event->user->roles ?? [])) {
            $event->user->wallet()->create([
                'balance' => 0,
            ]);
        }
    }
}
