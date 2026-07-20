<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Dashboard\UpdateProfileRequest;
use App\Http\Requests\Frontend\Dashboard\ChangePasswordRequest;
use App\Services\Frontend\Dashboard\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService,
    ) {}

    public function index(): Response
    {
        $userId  = Auth::id();
        $profile = $this->profileService->getProfile($userId);

        return Inertia::render('Frontend/Dashboard/Profile', [
            'profile' => $profile,
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $validated = $request->validated();

        $updateData = [];
        foreach (['name', 'phone', 'bio'] as $field) {
            if ($request->has($field)) {
                $updateData[$field] = $request->input($field);
            }
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $path;
        }

        if (!empty($updateData)) {
            $this->profileService->updateProfile(Auth::id(), $updateData);
        }

        return back()->with('success', 'Đã cập nhật hồ sơ thành công!');
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $request->validated();

        try {
            $this->profileService->changePassword(
                Auth::id(),
                $request->current_password,
                $request->new_password
            );
            return back()->with('success', 'Đã đổi mật khẩu thành công!');
        } catch (\Exception $e) {
            return back()->withErrors(['current_password' => $e->getMessage()]);
        }
    }
}
