<?php

namespace App\Repositories\Shared;

use App\DTO\Shared\NotificationFilterData;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function getNotificationsByRole(User $user, string $rolePrefix, NotificationFilterData $filter, int $perPage = 10): LengthAwarePaginator
    {
        $query = $user->notifications();

        if ($filter->startDate) {
            $query->whereDate('created_at', '>=', $filter->startDate);
        }

        if ($filter->endDate) {
            $query->whereDate('created_at', '<=', $filter->endDate);
        }

        if ($filter->type) {
            $query->where('type', 'like', '%' . $filter->type . '%');
        }

        return $query->paginate($perPage);
    }
}
