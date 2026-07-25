<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\SettingService;
use Inertia\Inertia;

class SettingController extends Controller
{
    protected $service;

    public function __construct(SettingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $settings = \App\Models\SystemSetting::all();
        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }
}
