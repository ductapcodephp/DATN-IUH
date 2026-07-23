<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function update(int $id, array $data): bool;
}
