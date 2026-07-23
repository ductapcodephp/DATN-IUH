<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserRegistered;
use App\Models\LoginAttempt;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class GenerateFirstSession
{
    public function handle(UserRegistered $event): void
    {
        $user = $event->user;
        $ip = $event->requestData['ip'];
        $ua = $event->requestData['user_agent'];
        $country = $event->requestData['country'];

        LoginAttempt::create([
            'email' => $user->email,
            'ip_address' => $ip,
            'user_agent' => $ua,
            'successful' => true,
            'failure_reason' => null,
            'country' => $country,
        ]);

        $plainToken = Str::random(60);
        $deviceId = md5($ua);

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $plainToken),
            'device_id' => $deviceId,
            'ip_address' => $ip,
            'user_agent' => $ua,
            'expires_at' => now()->addDays(30),
            'last_used_at' => now(),
            'is_revoked' => false,
        ]);
        Redis::del('user_session:'.$user->id);

        Cookie::queue('refresh_token', $plainToken, 43200, null, null, true, true, false, 'Lax');
    }
}
