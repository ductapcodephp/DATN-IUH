<?php

namespace App\Http\Controllers\Seller;

use App\DTO\Seller\SellerProfileData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\ApplySellerRequest;
use App\Repositories\SellerProfile\SellerProfileRepositoryInterface;
use App\Services\Seller\SellerProfileService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerProfileController extends Controller
{
    public function __construct(
        protected SellerProfileService $sellerProfileService,
        protected SellerProfileRepositoryInterface $profileRepository
    ) {}

    /**
     * Show the apply form / current status
     */
    public function showApplyForm(Request $request)
    {
        $profile = $this->profileRepository->findByUserId($request->user()->id);

        if ($profile && $profile->status === SellerProfileStatus::APPROVED->value) {
            return redirect()->route('seller.dashboard')->with('success', 'Bạn đã là Giảng viên.');
        }

        $bankAccount = $request->user()->bankAccounts()->where('is_default', true)->first() 
                    ?? $request->user()->bankAccounts()->first();
        
        return Inertia::render('Seller/Apply', [
            'profile' => $profile,
            'bankAccount' => $bankAccount
        ]);
    }

    /**
     * Submit or update application
     */
    public function apply(ApplySellerRequest $request): RedirectResponse
    {
        try {
            $profile = $this->profileRepository->findByUserId($request->user()->id);
            if ($profile && in_array($profile->status, [SellerProfileStatus::PENDING->value, SellerProfileStatus::APPROVED->value])) {
                return back()->withErrors(['system' => 'Bạn đã gửi yêu cầu trước đó hoặc đã là Giảng viên.']);
            }

            $data = SellerProfileData::fromRequest($request);
            $this->sellerProfileService->apply($data);

            return back()->with('success', 'Hồ sơ của bạn đã được gửi thành công và đang chờ xét duyệt.');
        } catch (Exception $e) {
            return back()->withErrors(['system' => $e->getMessage()])->withInput();
        }
    }
}
