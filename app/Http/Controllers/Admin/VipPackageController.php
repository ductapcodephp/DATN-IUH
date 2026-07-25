<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\VipPackageService;
use Inertia\Inertia;

class VipPackageController extends Controller
{
    protected $service;

    public function __construct(VipPackageService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $packages = \App\Models\VipPackage::orderBy('priority_level', 'desc')->get();
        return Inertia::render('Admin/VipPackages', [
            'packages' => $packages
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'badge_text' => 'nullable|string|max:50',
            'package_type' => 'required|string',
            'role_type' => 'required|in:user,seller',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'priority_level' => 'nullable|integer',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'max_storage_gb' => 'nullable|integer|min:1'
        ]);

        \App\Models\VipPackage::create($request->all());

        return redirect()->back()->with('success', 'Gói VIP đã được tạo thành công.');
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'badge_text' => 'nullable|string|max:50',
            'package_type' => 'required|string',
            'role_type' => 'required|in:user,seller',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'priority_level' => 'nullable|integer',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'max_storage_gb' => 'nullable|integer|min:1'
        ]);

        $package = \App\Models\VipPackage::findOrFail($id);
        $package->update($request->all());

        return redirect()->back()->with('success', 'Gói VIP đã được cập nhật thành công.');
    }

    public function destroy($id)
    {
        $package = \App\Models\VipPackage::findOrFail($id);
        
        // Cảnh báo nếu có người đang sử dụng gói này
        if (\App\Models\VipSubscription::where('vip_package_id', $id)->active()->exists()) {
            return redirect()->back()->with('error', 'Không thể xóa gói VIP này vì đang có người dùng đăng ký.');
        }

        $package->delete();

        return redirect()->back()->with('success', 'Gói VIP đã được xóa.');
    }

    public function toggleStatus($id)
    {
        $package = \App\Models\VipPackage::findOrFail($id);
        $package->is_active = !$package->is_active;
        $package->save();

        return redirect()->back()->with('success', 'Đã cập nhật trạng thái gói VIP.');
    }
}
