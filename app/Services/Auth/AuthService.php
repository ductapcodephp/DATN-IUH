<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Models\LoginAttempt;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\Auth\Strategies\LoginStrategyFactory;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;

class AuthService
{
    /**
     * Xử lý nghiệp vụ đăng ký tài khoản mới chuẩn cấu trúc Multi-Role (JSON)
     */
    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $referrerId = null;

            if (! empty($data['referred_by_code'])) {
                $referrerId = User::query()
                    ->where('referral_code', $data['referred_by_code'])
                    ->value('id');
            }

            $initialRole = $data['role'] ?? UserRole::USER->value;

            return User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'roles' => [$initialRole],
                'current_role' => $initialRole,
                'referred_by' => $referrerId,
                'is_active' => true,
            ]);
        });
    }

    /**
     * Xử lý nghiệp vụ xác thực đăng nhập
     */
    public function login(array $credentials, array $context, bool $remember = false): string
    {
        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            $this->recordLoginAttempt($credentials['email'], $context, false, 'invalid_credentials');
            throw new Exception('Thông tin đăng nhập không chính xác.');
        }

        if (! $user->is_active) {
            $this->recordLoginAttempt($credentials['email'], $context, false, 'account_disabled');
            throw new Exception('Tài khoản của bạn đã bị khóa.');
        }

        Auth::login($user, $remember);

        $this->recordLoginAttempt($credentials['email'], $context, true, null);
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $context['ip'],
        ]);

        $strategy = LoginStrategyFactory::make($user->current_role);

        return $strategy->handlePostLogin($user);
    }

    /**
     * Xử lý dọn dẹp phiên làm việc khi Logout
     */
    public function logout(User $user, string $userAgent): void
    {
        $deviceId = md5($userAgent);

        RefreshToken::query()
            ->where('user_id', $user->id)
            ->where('device_id', $deviceId)
            ->update(['is_revoked' => true]);

        Redis::del("user_session:{$user->id}");
    }

    /**
     * Ghi nhận lịch sử đăng nhập (Dùng cho Security Audit)
     */
    protected function recordLoginAttempt(string $email, array $context, bool $successful, ?string $reason): void
    {
        LoginAttempt::query()->create([
            'email' => $email,
            'ip_address' => $context['ip'],
            'user_agent' => $context['user_agent'],
            'country' => $context['country'],
            'successful' => $successful,
            'failure_reason' => $reason,
        ]);
    }
}
