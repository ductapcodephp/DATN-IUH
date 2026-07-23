<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserLoggedIn;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class IssueRefreshToken
{
    public function handle(UserLoggedIn $event): void
    {
        $user = $event->user;
        $ip = $event->context['ip'];
        $ua = $event->context['user_agent'];
        $deviceId = md5($ua);

        $plainToken = Str::random(60);

        RefreshToken::query()->updateOrCreate(
            ['user_id' => $user->id, 'device_id' => $deviceId],
            [
                'token' => hash('sha256', $plainToken),
                'ip_address' => $ip,
                'user_agent' => $ua,
                'expires_at' => now()->addDays(30),
                'last_used_at' => now(),
                'is_revoked' => false,
            ]
        );

        // 🔥 FIX: Xóa Redis cache cũ để middleware đọc lại từ DB
        Redis::del('user_session:'.$user->id);

        Cookie::queue('refresh_token', $plainToken, 43200, null, null, true, true, false, 'Lax');
    }
}
