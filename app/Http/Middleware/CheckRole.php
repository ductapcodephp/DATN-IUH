<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Services\Auth\Strategies\LoginStrategyFactory;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        $currentRole = $user->current_role instanceof UserRole
            ? $user->current_role->value
            : $user->current_role;

        if (in_array($currentRole, $roles)) {
            return $next($request);
        }

        $strategy = LoginStrategyFactory::make($user->current_role);
        $redirectUrl = $strategy->handlePostLogin($user);

        return redirect($redirectUrl)->withErrors([
            'system' => 'Bạn không có quyền truy cập trang này.',
        ]);
    }
}
