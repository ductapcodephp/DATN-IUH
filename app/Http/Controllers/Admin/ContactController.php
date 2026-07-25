<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;

use App\Http\Controllers\Controller;
use App\Services\Admin\ContactService;
use Inertia\Inertia;

class ContactController extends Controller
{
    protected $service;

    public function __construct(ContactService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $contacts = Contact::orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Contacts', [
            'contacts' => $contacts
        ]);
    }
}
