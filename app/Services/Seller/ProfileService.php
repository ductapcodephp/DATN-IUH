<?php

namespace App\Services\Seller;

use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function updateInfo(int $userId, array $data): bool
    {
        $updateData = [
            'name' => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
        ];

        if (isset($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['avatar']->store('avatars', 'public');
            $updateData['avatar'] = $path;
        }

        return $this->userRepository->update($userId, array_filter($updateData));
    }

    public function updatePassword(int $userId, string $newPassword): bool
    {
        return $this->userRepository->update($userId, [
            'password' => Hash::make($newPassword)
        ]);
    }

    public function updatePaymentInfo(int $userId, array $data): bool
    {
        return $this->userRepository->update($userId, [
            'bank_name' => $data['bank_name'] ?? null,
            'bank_account_no' => $data['bank_account_no'] ?? null,
            'bank_account_name' => $data['bank_account_name'] ?? null,
        ]);
    }
}
