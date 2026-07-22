<?php

declare(strict_types=1);

namespace App\Repositories\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function findIdByReferralCode(?string $code): ?int
    {
        if (!$code) {
            return null;
        }
        return User::query()->where('referral_code', $code)->value('id');
    }

    public function create(array $data): User
    {
        return User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'current_role' => $data['role'],
            'referred_by' => $data['referred_by'] ?? null,
            'is_active' => true,
        ]);
    }
}
