<?php

namespace App\Services\Auth\Strategies;

use App\Enums\UserRole;
use InvalidArgumentException;

class LoginStrategyFactory
{
    public static function make(UserRole $role): LoginStrategyInterface
    {
        return match ($role) {
            UserRole::USER => new UserLoginStrategy,
            UserRole::SELLER => new SellerLoginStrategy,
            UserRole::ADMIN, UserRole::ROOT => new AdminLoginStrategy,
            default => throw new InvalidArgumentException("Không tìm thấy chiến lược login cho role: {$role->value}"),
        };
    }
}
