<?php
declare(strict_types=1);
namespace App\Repositories\Frontend\Dashboard;
use App\Models\User;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function getProfile(int $userId): ?User
    {
        return User::find($userId);
    }
    public function updateProfile(int $userId, array $data): User
    {
        $user = User::findOrFail($userId);
        $user->update($data);
        return $user->fresh();
    }
    public function updatePassword(int $userId, string $hashedPassword): bool
    {
        return (bool) User::where('id', $userId)->update(['password' => $hashedPassword]);
    }
}
