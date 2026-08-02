<?php

namespace App\Http\Controllers\Admin;

use App\Models\SystemSetting;

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
        $settings = SystemSetting::all();
        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(\Illuminate\Http\Request $request)
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        
        return redirect()->back()->with('success', 'Cập nhật cài đặt thành công');
    }
}
