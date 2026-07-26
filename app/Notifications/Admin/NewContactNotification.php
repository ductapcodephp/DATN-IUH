<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewContactNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $contact;

    public function __construct($contact)
    {
        $this->contact = $contact;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'contact',
            'title' => 'Liên hệ mới từ ' . $this->contact->name,
            'message' => 'Chủ đề: ' . $this->contact->subject,
            'url' => route('admin.contacts'),
            'icon' => 'fa-envelope',
            'color' => 'primary',
        ];
    }
}
