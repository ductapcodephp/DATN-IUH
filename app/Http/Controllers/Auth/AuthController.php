<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Auth\AuthService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

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
        $context = $this->extractRequestContext($request);

        try {
            // 1. Gọi Service tạo User
            $user = $this->authService->register($request->validated());

            // 2. Đăng nhập ngay sau khi đăng ký
            Auth::login($user);
            $request->session()->regenerate();

            // 3. Kích hoạt Event (Tạo ví, sinh token, log ngầm)
            UserRegistered::dispatch($user, $context);

            // 4. Lấy route redirect qua Strategy
            $redirectUrl = $this->authService->login(
                ['email' => $user->email, 'password' => $request->input('password')],
                $context
            );

            return redirect()->to($redirectUrl)
                ->with('success', 'Đăng ký tài khoản thành công!');

        } catch (Exception $e) {
            Log::error('Register Error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return back()->withErrors(['system' => 'Đăng ký thất bại. Đã có lỗi hệ thống xảy ra.']);
        }
    }

    public function login(LoginRequest $request): RedirectResponse
    {

        $context = $this->extractRequestContext($request);

        try {
            // Gọi Service thực thi Login & lấy đường dẫn theo Role Strategy
            $redirectUrl = $this->authService->login(
                $request->only('email', 'password'),
                $context,
                $request->boolean('remember')
            );

            $request->session()->regenerate();

            // Kích hoạt Event
            /** @var User $user */
            $user = Auth::user();
            UserLoggedIn::dispatch($user, $context);
            Log::info('After dispatch UserLoggedIn');

            return redirect()->intended($redirectUrl);

        } catch (Exception $e) {
            Log::error('Login Error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return back()
                ->withErrors(['email' => $e->getMessage()])
                ->withInput($request->only('email', 'remember'));
        }
    }

    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            $this->authService->logout($user, $request->userAgent() ?? 'Unknown');
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Cookie::queue(Cookie::forget('refresh_token'));

        return redirect()->route('login');
    }

    /**
     * Helper gom thông tin thiết bị / IP của Client
     */
    protected function extractRequestContext(Request $request): array
    {
        return [
            'ip' => $request->ip() ?? '127.0.0.1',
            'user_agent' => $request->userAgent() ?? 'Unknown',
            'country' => $request->header('CF-IPCountry') ?? 'VN',
        ];
    }
}
