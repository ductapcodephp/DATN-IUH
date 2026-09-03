<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Seller\DistributedCouponResource;
use App\Models\DistributedCoupon;
use App\Models\VipPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DistributedCouponController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DistributedCoupon::with(['user', 'vipPackage', 'coupon'])
            ->latest('distributed_at');

        // Filter theo gói VIP
        if ($request->filled('vip_package_id')) {
            $query->where('vip_package_id', $request->input('vip_package_id'));
        }

        // Filter theo trạng thái sử dụng
        if ($request->filled('status')) {
            if ($request->input('status') === 'used') {
                $query->where('is_used', true);
            } elseif ($request->input('status') === 'unused') {
                $query->where('is_used', false)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                            ->orWhere('expires_at', '>=', now());
                    });
            } elseif ($request->input('status') === 'expired') {
                $query->where('is_used', false)
                    ->whereNotNull('expires_at')
                    ->where('expires_at', '<', now());
            }
        }

        // Tìm kiếm theo mã code hoặc tên/email user
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $distributedCoupons = $query->paginate(15)->withQueryString();
        $vipPackages = VipPackage::where('role_type', 'user')->active()->select('id', 'name')->get();

        // Thống kê tổng quan
        $stats = [
            'total' => DistributedCoupon::count(),
            'used' => DistributedCoupon::where('is_used', true)->count(),
            'unused' => DistributedCoupon::where('is_used', false)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                })->count(),
            'expired' => DistributedCoupon::where('is_used', false)
                ->whereNotNull('expires_at')
                ->where('expires_at', '<', now())
                ->count(),
        ];

        return Inertia::render('Admin/DistributedCoupons/Index', [
            'distributedCoupons' => DistributedCouponResource::collection($distributedCoupons),
            'vipPackages' => $vipPackages,
            'filters' => $request->only(['vip_package_id', 'status', 'search']),
            'stats' => $stats,
        ]);
    }
}
