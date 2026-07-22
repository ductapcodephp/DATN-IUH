<?php

namespace App\Services\Auth\Strategies;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminLoginStrategy implements LoginStrategyInterface
{
    public function handlePostLogin(User $user): string
    {
        Log::warning("Admin [ID: {$user->id}] đăng nhập vào lúc " . now());

        return route('frontend.home');
    }
}
