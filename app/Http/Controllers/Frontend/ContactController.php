<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Topic;
use App\Models\SystemSetting;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Admin\NewContactNotification;

class ContactController extends Controller
{
    public function index()
    {
        $topics = Topic::where('type', 'contact')->get();
        return Inertia::render('Frontend/Contact/Index', [
            'contactTopics' => $topics
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        if (SystemSetting::where('key', 'notify_new_contact')->value('value') == '1') {
            $admins = User::whereIn('current_role', [UserRole::ADMIN, UserRole::ROOT])->get();
            Notification::send($admins, new NewContactNotification($contact));
        }

        return back()->with('success', 'Gừi liên hệ thành công. Chúng tôi sẽ sớm phản hồi.');
    }
}
