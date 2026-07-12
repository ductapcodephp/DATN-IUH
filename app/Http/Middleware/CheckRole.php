<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\Auth\Strategies\LoginStrategyFactory;
use App\Enums\UserRole;
class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // Cần kiểm tra xem current_role của user có nằm trong mảng roles cho phép không
        // Nếu user->current_role là đối tượng enum thì lấy value
        $currentRole = $user->current_role instanceof UserRole 
            ? $user->current_role->value 
            : $user->current_role;

        if (in_array($currentRole, $roles)) {
            return $next($request);
        }

        // Nếu không có quyền, redirect về trang mặc định của user bằng Strategy Pattern
        $strategy = LoginStrategyFactory::make($user->current_role);
        $redirectUrl = $strategy->handlePostLogin($user);

        return redirect($redirectUrl)->withErrors([
            'system' => 'Bạn không có quyền truy cập trang này.'
        ]);
    }
}
