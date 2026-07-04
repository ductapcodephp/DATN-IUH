<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case SELLER = 'seller';
    case ADMIN = 'admin'; // 🔥 Đã bổ sung cho khớp với hệ thống
    case ROOT = 'root';

    public function redirectRoute(): string
    {
        return match ($this) {
            self::ROOT => 'admin.dashboard',
            self::ADMIN => 'admin.dashboard', // Admin cũng vào trang quản trị
            self::SELLER => 'seller.dashboard',
            self::USER => 'home',
        };
    }

    /**
     * Kiểm tra xem role này có quyền của Seller không
     */
    public function isSeller(): bool
    {
        return in_array($this, [
            self::SELLER,
            self::ADMIN,
            self::ROOT,
        ]);
    }

    /**
     * Kiểm tra xem role này có quyền quản trị hệ thống không
     */
    public function isAdmin(): bool
    {
        return in_array($this, [
            self::ADMIN,
            self::ROOT,
        ]);
    }
}