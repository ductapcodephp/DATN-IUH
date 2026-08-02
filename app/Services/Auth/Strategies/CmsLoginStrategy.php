<?php

namespace App\Services\Auth\Strategies;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class CmsLoginStrategy implements LoginStrategyInterface
{
    public function handlePostLogin(User $user): string
    {
        Log::info("CMS User [ID: {$user->id}] đăng nhập vào lúc ".now());

        return route('cms.page.index');
    }
}
