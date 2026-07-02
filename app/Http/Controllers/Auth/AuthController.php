<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\LoginAttempt;
use App\Models\RefreshToken;
use App\Events\Auth\UserRegistered;
use App\Events\Auth\UserLoggedIn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redis;

class AuthController extends Controller
{
  
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }


    public function register(RegisterRequest $request): RedirectResponse
    {
        $context = [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent() ?? 'Unknown',
            'country' => $request->header('CF-IPCountry') ?? 'VN'
        ];

        try {
            $user = DB::transaction(function () use ($request) {
                $referrerId = null;
                if ($request->filled('referred_by_code')) {
                    // Thêm query() chặn đứng gạch đỏ IDE
                    $referrerId = User::query()->where('referral_code', $request->referred_by_code)->value('id');
                }

                return User::query()->create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'phone' => $request->phone,
                    'role' => $request->role,
                    'current_role' => $request->role,
                    'referred_by' => $referrerId,
                    'is_active' => true,
                ]);
            });

            Auth::login($user);
            $request->session()->regenerate();

            // Kích hoạt Event -> Listener tự tạo ví, sinh token thiết bị, ghi log ngầm
            UserRegistered::dispatch($user, $context);

            return redirect()->route('seller.dashboard')->with('success', 'Đăng ký tài khoản thành công!');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Register Error: ' . $e->getMessage());
            return back()->withErrors(['system' => 'Đăng ký thất bại. Đã có lỗi hệ thống xảy ra.']);
        }
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $email = $request->input('email');
        $context = [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent() ?? 'Unknown',
            'country' => $request->header('CF-IPCountry') ?? 'VN'
        ];

        $user = User::query()->where('email', $email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            LoginAttempt::query()->create([
                'email' => $email, 'ip_address' => $context['ip'], 'user_agent' => $context['user_agent'],
                'successful' => false, 'failure_reason' => 'invalid_credentials', 'country' => $context['country'],
            ]);
            return back()->withErrors(['email' => 'Thông tin đăng nhập không chính xác.']);
        }

        if (!$user->is_active) {
            LoginAttempt::query()->create([
                'email' => $email, 'ip_address' => $context['ip'], 'user_agent' => $context['user_agent'],
                'successful' => false, 'failure_reason' => 'account_disabled', 'country' => $context['country'],
            ]);
            return back()->withErrors(['email' => 'Tài khoản của bạn đã bị khóa.']);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        UserLoggedIn::dispatch($user, $context);

        return redirect()->intended(route('seller.dashboard'));
    }
   public function logout(Request $request): RedirectResponse
{
    $user = Auth::user();

    if ($user) {
        $deviceId = md5($request->userAgent() ?? 'Unknown');
        RefreshToken::query()
            ->where('user_id', $user->id)
            ->where('device_id', $deviceId)
            ->update(['is_revoked' => true]);

        // 🔥 FIX: Xóa Redis khi logout
        Redis::del("user_session:" . $user->id);
    }

    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    Cookie::queue(Cookie::forget('refresh_token'));

    return redirect()->route('login');
}
}
