<?php

namespace App\Services\Seller;

use App\DTO\Seller\SellerProfileData;
use App\Enums\SellerProfileStatus;
use App\Enums\UserRole;
use App\Models\SellerProfile;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Repositories\SellerProfile\SellerProfileRepositoryInterface;
use App\Events\SellerApplied;
use App\Events\SellerApproved;
use App\Events\SellerRejected;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class SellerProfileService
{
    public function __construct(
        protected SellerProfileRepositoryInterface $profileRepository
    ) {}

    /**
     * Apply or re-apply for seller profile
     */
    public function apply(SellerProfileData $data): SellerProfile
    {
        $existingProfile = $this->profileRepository->findByUserId($data->user_id);
        
        if ($existingProfile && $existingProfile->status === SellerProfileStatus::APPROVED->value) {
            throw new Exception("You are already an approved seller.");
        }

        $profileArray = $data->toArray();
        $profileArray['status'] = SellerProfileStatus::PENDING->value;
        $profileArray['reject_reason'] = null;

        // Handle File Uploads
        if ($data->identity_card_front) {
            if ($existingProfile && $existingProfile->identity_card_front) {
                Storage::disk('public')->delete($existingProfile->identity_card_front);
            }
            $profileArray['identity_card_front'] = $data->identity_card_front->store('seller_profiles/id_cards', 'public');
        }

        if ($data->identity_card_back) {
            if ($existingProfile && $existingProfile->identity_card_back) {
                Storage::disk('public')->delete($existingProfile->identity_card_back);
            }
            $profileArray['identity_card_back'] = $data->identity_card_back->store('seller_profiles/id_cards', 'public');
        }

        // Save bank account to UserBankAccount
        UserBankAccount::updateOrCreate(
            [
                'user_id' => $data->user_id,
                'account_number' => $data->bank_account_number
            ],
            [
                'bank_name' => $data->bank_name,
                'account_name' => $data->bank_account_name,
                'is_default' => true
            ]
        );

        $profile = $this->profileRepository->updateOrCreate($data->user_id, $profileArray);

        // Send email to user via queued event
        $user = User::find($data->user_id);
        if ($user) {
            Event::dispatch(new SellerApplied($user));
        }

        return $profile;
    }

    /**
     * Get pending profiles for admin
     */
    public function getPendingProfiles(): Collection
    {
        return $this->profileRepository->getPendingProfiles();
    }

    /**
     * Approve a seller profile
     */
    public function approve(int $profileId): bool
    {
        $profile = $this->profileRepository->findById($profileId);
        
        if (!$profile || $profile->status !== SellerProfileStatus::PENDING->value) {
            throw new Exception("Profile not found or not pending.");
        }

        $this->profileRepository->updateStatus($profileId, SellerProfileStatus::APPROVED->value);

        // Update user role
        $user = User::find($profile->user_id);
        if ($user) {
            $roles = $user->roles ?? [];
            if (!in_array(UserRole::SELLER->value, $roles)) {
                $roles[] = UserRole::SELLER->value;
            }
            $user->roles = $roles;
            $user->current_role = UserRole::SELLER;
            $user->save();

            // Send email to user via queued event
            Event::dispatch(new SellerApproved($user));
        }

        return true;
    }

    /**
     * Reject a seller profile
     */
    public function reject(int $profileId, string $reason): bool
    {
        $profile = $this->profileRepository->findById($profileId);
        
        if (!$profile || $profile->status !== SellerProfileStatus::PENDING->value) {
            throw new Exception("Profile not found or not pending.");
        }

        $updated = $this->profileRepository->updateStatus($profileId, SellerProfileStatus::REJECTED->value, $reason);

        if ($updated) {
            $user = User::find($profile->user_id);
            if ($user) {
                Event::dispatch(new SellerRejected($user, $reason));
            }
        }

        return $updated;
    }
}
