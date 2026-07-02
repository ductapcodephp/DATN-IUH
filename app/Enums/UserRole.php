<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case SELLER = 'seller';
    case ROOT = 'root';


    public function redirectRoute(): string
    {
        return match ($this) {
            self::ROOT => 'admin.dashboard',
            self::SELLER => 'seller.dashboard',
            self::USER => 'home',
        };
    }


    public function isSeller(): bool
    {
        return in_array($this, [
            self::SELLER,
            self::ROOT,
        ]);
    }


    public function isAdmin(): bool
    {
        return $this === self::ROOT;
    }
}