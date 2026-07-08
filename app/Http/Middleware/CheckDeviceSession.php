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
            // Lần đầu đăng nhập hoặc browser chưa gửi lại cookie refresh_token thì không nên đá session ngay.
            // Hệ thống vẫn giữ session Auth chuẩn của Laravel và sẽ tạo/cập nhật token ở request sau.
            return $next($request);
        }

        $deviceId = md5($request->userAgent() ?? 'Unknown');
        $tokenHash = hash('sha256', $plainToken);

        $redisKey = "user_session:" . Auth::id();

        // 1. Thử lấy data từ Redis trước
        $sessionData = Redis::get($redisKey);
        $isCacheMiss = false;

        if ($sessionData) {
            $session = json_decode($sessionData, true);
        } else {
            // 2. Nếu hụt cache, vào MySQL tìm token ĐANG HỢP LỆ của thiết bị này
            $tokenRecord = RefreshToken::query()
                ->where('user_id', Auth::id())
                ->where('device_id', $deviceId)
                ->where('token', $tokenHash)
                ->first();

            if (!$tokenRecord) {
                // Nếu chưa có record token khớp cho request này, bỏ qua kiểm tra để tránh false positive ở lần đăng nhập đầu tiên.
                return $next($request);
            }

            if ($tokenRecord->is_revoked || $tokenRecord->expires_at->isPast()) {
                return $this->forceLogout($request);
            }

            $session = [
                'id' => $tokenRecord->id,
                'device_id' => $tokenRecord->device_id, // 🔥 Lưu thêm device_id vào để check
                'token' => $tokenRecord->token,         // 🔥 Lưu thêm token_hash vào để check
                'is_revoked' => $tokenRecord->is_revoked,
                'expires_at' => $tokenRecord->expires_at->toDateTimeString(),
                'last_used_at' => $tokenRecord->last_used_at ? $tokenRecord->last_used_at->toDateTimeString() : null,
                'last_sync_db' => now()->toDateTimeString(), 
            ];
            
            $isCacheMiss = true;
        }

        // 🔥 3. KIỂM TRA ĐỘC QUYỀN THIẾT BỊ:
        // Nếu cookie tồn tại nhưng token/thiết bị không khớp thì đá session ngay.
        if ($session['device_id'] !== $deviceId || $session['token'] !== $tokenHash) {
            // Không xóa Redis ở đây vì đây là request của máy cũ (lậu), xóa đi sẽ làm máy mới bị ảnh hưởng.
            return $this->forceLogout($request);
        }

        // 4. Kiểm tra tính hợp lệ về thời gian / thu hồi
        if ($session['is_revoked'] || Carbon::parse($session['expires_at'])->isPast()) {
            Redis::del($redisKey);
            return $this->forceLogout($request);
        }

        // 5. Cập nhật thời gian hoạt động và Sync DB sau 10 phút
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

        // Ghi nhận lại data mới vào Redis
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