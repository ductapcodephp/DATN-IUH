<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectSellerRequest;
use App\Services\Seller\SellerProfileService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSellerController extends Controller
{
    public function __construct(
        protected SellerProfileService $sellerProfileService
    ) {}

    /**
     * Get pending applications page
     */
    public function indexPending(): Response
    {
        $profiles = $this->sellerProfileService->getPendingProfiles();
        
        return Inertia::render('Admin/Sellers/Pending', [
            'profiles' => $profiles
        ]);
    }

    /**
     * Approve an application
     */
    public function approve(int $id): RedirectResponse
    {
        try {
            $this->sellerProfileService->approve($id);
            
            return back()->with('success', 'Đã duyệt hồ sơ giảng viên thành công.');
        } catch (Exception $e) {
            return back()->withErrors(['system' => 'Lỗi khi duyệt: ' . $e->getMessage()]);
        }
    }

    /**
     * Reject an application
     */
    public function reject(int $id, RejectSellerRequest $request): RedirectResponse
    {
        try {
            $this->sellerProfileService->reject($id, $request->input('reject_reason'));
            
            return back()->with('success', 'Đã từ chối hồ sơ giảng viên.');
        } catch (Exception $e) {
            return back()->withErrors(['system' => 'Lỗi khi từ chối: ' . $e->getMessage()]);
        }
    }
}
