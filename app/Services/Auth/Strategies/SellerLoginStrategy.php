<?php

namespace App\Services\Auth\Strategies;

use App\Models\User;

class SellerLoginStrategy implements LoginStrategyInterface
{
    public function handlePostLogin(User $user): string
    {
        return route('seller.dashboard');
    }
}
