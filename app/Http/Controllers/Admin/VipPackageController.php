<?php

namespace App\Http\Controllers\Admin;

use App\Models\VipPackage;
use App\Models\VipSubscription;
use App\Http\Controllers\Controller;
use App\Services\Admin\VipPackageService;
use Inertia\Inertia;
use App\Http\Requests\Admin\StoreVipPackageRequest;
use App\Http\Requests\Admin\UpdateVipPackageRequest;

class VipPackageController extends Controller
{
    protected $service;

    public function __construct(VipPackageService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $packages = VipPackage::orderBy('priority_level', 'desc')->get();
        return Inertia::render('Admin/VipPackages', [
            'packages' => $packages
        ]);
    }

    public function store(StoreVipPackageRequest $request)
    {
        $data = $request->validated();
        if (($data['package_type'] ?? '') === 'storage') {
            $data['badge_text'] = null;
        }

        VipPackage::create($data);

        return redirect()->back()->with('success', 'Gói VIP đã được tạo thành công.');
    }

    public function update(UpdateVipPackageRequest $request, $id)
    {
        $package = VipPackage::findOrFail($id);
        $data = $request->validated();
        if (($data['package_type'] ?? '') === 'storage') {
            $data['badge_text'] = null;
        }

        $package->update($data);

        return redirect()->back()->with('success', 'Gói VIP đã được cập nhật thành công.');
    }

    public function destroy($id)
    {
        $package = VipPackage::findOrFail($id);
        
        if (VipSubscription::where('vip_package_id', $id)->active()->exists()) {
            return redirect()->back()->with('error', 'Không thể xóa gói VIP này vì đang có người dùng đăng ký.');
        }

        $package->delete();

        return redirect()->back()->with('success', 'Gói VIP đã được xóa.');
    }

    public function toggleStatus($id)
    {
        $package = VipPackage::findOrFail($id);
        $package->is_active = !$package->is_active;
        $package->save();

        return redirect()->back()->with('success', 'Đã cập nhật trạng thái gói VIP.');
    }
}
