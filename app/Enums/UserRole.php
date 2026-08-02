<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case SELLER = 'seller';
    case ADMIN = 'admin';
    case ROOT = 'root';
    case CMS = 'cms';

    public function redirectRoute(): string
    {
        return match ($this) {
            self::ROOT => 'admin.dashboard',
            self::ADMIN => 'admin.dashboard',
            self::SELLER => 'seller.dashboard',
            self::USER => 'frontend.home',
            self::CMS => 'cms.page.index',
        };
    }

    public function isSeller(): bool
    {
        return in_array($this, [
            self::SELLER,
            self::ADMIN,
            self::ROOT,
        ]);
    }


    public function isAdmin(): bool
    {
        return in_array($this, [
            self::ADMIN,
            self::ROOT,
            self::CMS,
        ]);
    }
}
