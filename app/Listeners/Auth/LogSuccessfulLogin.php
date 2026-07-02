<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserLoggedIn;
use App\Models\LoginAttempt;

class LogSuccessfulLogin
{
    public function handle(UserLoggedIn $event): void
    {
        LoginAttempt::create([
            'email' => $event->user->email,
            'ip_address' => $event->context['ip'],
            'user_agent' => $event->context['user_agent'],
            'successful' => true,
            'failure_reason' => null,
            'country' => $event->context['country'],
        ]);
    }
}
