<?php
declare(strict_types=1);
namespace App\Repositories\Frontend\Dashboard;
use App\Models\User;

interface ProfileRepositoryInterface
{
    public function getProfile(int $userId): ?User;
    public function updateProfile(int $userId, array $data): User;
    public function updatePassword(int $userId, string $hashedPassword): bool;
}
