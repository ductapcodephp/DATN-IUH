<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class CheckDeviceSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_without_refresh_cookie_is_not_forced_logout(): void
    {
        Route::middleware('web')->get('/check-device-session', function () {
            return response()->json(['ok' => true]);
        });

        $user = User::factory()->create([
            'roles' => ['user'],
            'current_role' => 'user',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->get('/check-device-session');

        $response->assertOk();
        $response->assertJson(['ok' => true]);
    }
}
