<?php

namespace App\Services\Shared;

use App\DTO\Shared\NotificationFilterData;
use App\Models\User;
use App\Repositories\Shared\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function __construct(
        protected NotificationRepositoryInterface $notificationRepository
    ) {}

    public function getAdminNotifications(User $user, NotificationFilterData $filter, int $perPage = 10): LengthAwarePaginator
    {
        return $this->notificationRepository->getNotificationsByRole($user, 'App\Notifications\Admin', $filter, $perPage);
    }

    public function getSellerNotifications(User $user, NotificationFilterData $filter, int $perPage = 10): LengthAwarePaginator
    {
        return $this->notificationRepository->getNotificationsByRole($user, 'App\Notifications\Seller', $filter, $perPage);
    }
}
