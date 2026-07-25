<?php

namespace App\Http\Controllers\Admin;

use App\DTO\Shared\NotificationFilterData;
use App\Http\Controllers\Controller;
use App\Services\Shared\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request)
    {
        $filter = NotificationFilterData::fromRequest($request);
        $notifications = $this->notificationService->getAdminNotifications($request->user(), $filter);

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
            'filters' => $request->only(['start_date', 'end_date', 'type'])
        ]);
    }
}
