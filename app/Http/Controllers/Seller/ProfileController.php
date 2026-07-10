<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\Seller\ProfileService;
use App\Http\Requests\Seller\UpdateProfileInfoRequest;
use App\Http\Requests\Seller\UpdateProfilePasswordRequest;
use App\Http\Requests\Seller\UpdateProfilePaymentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function edit(Request $request)
    {
        return Inertia::render('Seller/Profile/Index', [
            'user' => $request->user(),
        ]);
    }

    public function updateInfo(UpdateProfileInfoRequest $request)
    {
        $this->profileService->updateInfo($request->user()->id, $request->validated());
        return back()->with('success', 'Thông tin cá nhân đã được cập nhật.');
    }

    public function updatePassword(UpdateProfilePasswordRequest $request)
    {
        $this->profileService->updatePassword($request->user()->id, $request->validated()['password']);
        return back()->with('success', 'Mật khẩu đã được cập nhật.');
    }

    public function updatePayment(UpdateProfilePaymentRequest $request)
    {
        $this->profileService->updatePaymentInfo($request->user()->id, $request->validated());
        return back()->with('success', 'Thông tin thanh toán đã được cập nhật.');
    }
}
