<?php

namespace App\Http\Controllers\Seller;

use Exception;
use App\Http\Controllers\Controller;
use App\DTO\Seller\VipPackage\BuyVipData;
use App\Services\Seller\VipPackageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VipPackageController extends Controller
{
    protected $vipPackageService;

    public function __construct(VipPackageService $vipPackageService)
    {
        $this->vipPackageService = $vipPackageService;
    }

    public function index()
    {
        $data = $this->vipPackageService->getIndexData(Auth::id());
        return Inertia::render('Seller/VipPackages/Index', $data);
    }

    public function buy(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:vip_packages,id',
            'payment_method' => 'required|in:vnpay,stripe,wallet',
        ]);

        try {
            $data = BuyVipData::fromRequest($request);
            $result = $this->vipPackageService->processBuy(Auth::id(), $data);

            if ($result['type'] === 'wallet') {
                return back()->with('success', $result['message']);
            }

            return Inertia::location($result['url']);
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
