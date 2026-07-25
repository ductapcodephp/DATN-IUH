<?php

namespace App\Repositories\Shared;

use App\DTO\Shared\NotificationFilterData;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\User;

interface NotificationRepositoryInterface
{
    /**
     * Lấy danh sách thông báo theo role (dựa trên prefix type)
     */
    public function getNotificationsByRole(User $user, string $rolePrefix, NotificationFilterData $filter, int $perPage = 10): LengthAwarePaginator;
}
