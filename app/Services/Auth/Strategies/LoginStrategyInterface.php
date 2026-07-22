<?php

declare(strict_types=1);

namespace App\Services\Auth\Strategies;

use App\Models\User;

interface LoginStrategyInterface
{    public function handlePostLogin(User $user): string;
}
