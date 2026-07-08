<?php

namespace App\Services\Auth\Strategies;

use App\Models\User;

class SellerLoginStrategy implements LoginStrategyInterface
{
    public function handlePostLogin(User $user): string
    {
        // Ví dụ logic mở rộng chỉ Seller mới có: 
        // Nếu chưa cập nhật thông tin thanh toán tài khoản ngân hàng -> bắt qua trang xác minh
        // if (!$user->bank_account) {
        //     return route('seller.onboarding');
        // }

        return route('seller.dashboard');
    }
}