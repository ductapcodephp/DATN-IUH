<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function markAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    }
}
