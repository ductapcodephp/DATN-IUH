<?php

declare(strict_types=1);

namespace App\Services\Frontend\Dashboard;

use App\Repositories\Frontend\Dashboard\ProfileRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function __construct(protected ProfileRepositoryInterface $profileRepository) {}

    public function getProfile(int $userId): array
    {
        $user = $this->profileRepository->getProfile($userId);

        return [
            'id' => $user->id, 'name' => $user->name, 'email' => $user->email,
            'phone' => $user->phone, 'avatar' => $user->avatar, 'bio' => $user->bio,
            'created_at' => $user->created_at,
        ];
    }

    public function updateProfile(int $userId, array $data): array
    {
        $allowedFields = ['name', 'phone', 'bio', 'avatar'];
        $filteredData = array_intersect_key($data, array_flip($allowedFields));
        $user = $this->profileRepository->updateProfile($userId, $filteredData);

        return [
            'id' => $user->id, 'name' => $user->name, 'email' => $user->email,
            'phone' => $user->phone, 'avatar' => $user->avatar, 'bio' => $user->bio,
        ];
    }

    public function changePassword(int $userId, string $currentPassword, string $newPassword): bool
    {
        $user = $this->profileRepository->getProfile($userId);
        if (! Hash::check($currentPassword, $user->password)) {
            throw new \Exception('Mật khẩu hiện tại không chính xác.');
        }

        return $this->profileRepository->updatePassword($userId, Hash::make($newPassword));
    }
}
