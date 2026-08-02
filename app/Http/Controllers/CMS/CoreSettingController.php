<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\CoreSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoreSettingController extends Controller
{
    public function index()
    {
        $settings = CoreSetting::all()->pluck('setting_value', 'setting_key');
        
        return Inertia::render('CMS/Setting/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);
        
        foreach ($data as $key => $value) {
            $valueToSave = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : ($value ?? '');
            CoreSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $valueToSave, 'setting_type' => is_array($value) ? 'json' : 'text']
            );
        }

        return back()->with('success', 'Đã lưu cài đặt chung thành công!');
    }
}
