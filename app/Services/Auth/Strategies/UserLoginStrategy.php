<?php

namespace App\Services\Auth\Strategies;

use App\Models\User;

class UserLoginStrategy implements LoginStrategyInterface
{
    public function handlePostLogin(User $user): string
    {
        return route('frontend.home');
    }
}
