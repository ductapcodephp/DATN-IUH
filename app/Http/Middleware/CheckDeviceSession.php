<?php

namespace App\Http\Middleware;

use App\Models\RefreshToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Carbon;

class CheckDeviceSession
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $plainToken = Cookie::get('refresh_token');
        if (!$plainToken) {
            return $next($request);
        }

        $deviceId = md5($request->userAgent() ?? 'Unknown');
        $tokenHash = hash('sha256', $plainToken);

        $redisKey = "user_session:" . Auth::id();

        $sessionData = Redis::get($redisKey);
        $isCacheMiss = false;

        if ($sessionData) {
            $session = json_decode($sessionData, true);
        } else {
            $tokenRecord = RefreshToken::query()
                ->where('user_id', Auth::id())
                ->where('device_id', $deviceId)
                ->where('token', $tokenHash)
                ->first();

            if (!$tokenRecord) {
                return $next($request);
            }

            if ($tokenRecord->is_revoked || $tokenRecord->expires_at->isPast()) {
                return $this->forceLogout($request);
            }

            $session = [
                'id' => $tokenRecord->id,
                'device_id' => $tokenRecord->device_id,
                'token' => $tokenRecord->token,
                'is_revoked' => $tokenRecord->is_revoked,
                'expires_at' => $tokenRecord->expires_at->toDateTimeString(),
                'last_used_at' => $tokenRecord->last_used_at ? $tokenRecord->last_used_at->toDateTimeString() : null,
                'last_sync_db' => now()->toDateTimeString(), 
            ];
            
            $isCacheMiss = true;
        }

        if ($session['device_id'] !== $deviceId || $session['token'] !== $tokenHash) {
            return $this->forceLogout($request);
        }

        if ($session['is_revoked'] || Carbon::parse($session['expires_at'])->isPast()) {
            Redis::del($redisKey);
            return $this->forceLogout($request);
        }

        $now = now();
        $session['last_used_at'] = $now->toDateTimeString();

        if (!$isCacheMiss) {
            $lastSync = Carbon::parse($session['last_sync_db']);
            if ($now->diffInSeconds($lastSync) > 600) { 
                RefreshToken::query()->where('id', $session['id'])->update([
                    'last_used_at' => $now
                ]);
                $session['last_sync_db'] = $now->toDateTimeString();
            }
        }

        Redis::setex($redisKey, 86400, json_encode($session));

        return $next($request);
    }

    private function forceLogout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Cookie::queue(Cookie::forget('refresh_token'));

        return redirect()->route('login')->withErrors([
            'system' => 'Tài khoản của bạn đã được đăng nhập từ một thiết bị khác.'
        ]);
    }
}