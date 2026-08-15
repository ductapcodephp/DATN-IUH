<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\Admin\SettingService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
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

    public function update(Request $request)
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        
        Cache::forget('system_settings_all');

        return redirect()->back()->with('success', 'Cập nhật cài đặt thành công');
    }

    public function runCron(Request $request)
    {
        $request->validate([
            'command' => 'required|string|in:payments:cancel-abandoned,seller:release-earnings,vip:check-expiring,ads:reset-daily,coupons:expire,video-progress:sync',
        ]);

        try {
            $command = $request->input('command');
            Artisan::call($command);
            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => "Đã thực thi lệnh `php artisan {$command}` thành công!",
                'output' => trim($output) ?: 'Lệnh đã hoàn thành không có output cảnh báo.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thực thi lệnh: ' . $e->getMessage(),
            ], 500);
        }
    }
}
