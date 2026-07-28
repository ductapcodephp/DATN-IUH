<?php

namespace App\Repositories\SellerProfile;

use App\Models\SellerProfile;
use App\Enums\SellerProfileStatus;
use Illuminate\Database\Eloquent\Collection;

class SellerProfileRepository implements SellerProfileRepositoryInterface
{
    public function findByUserId(int $userId): ?SellerProfile
    {
        return SellerProfile::where('user_id', $userId)->first();
    }

    public function updateOrCreate(int $userId, array $data): SellerProfile
    {
        return SellerProfile::updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }

    public function getPendingProfiles(): Collection
    {
        return SellerProfile::with(['user', 'user.bankAccounts'])
            ->where('status', SellerProfileStatus::PENDING->value)
            ->latest()
            ->get();
    }

    public function findById(int $id): ?SellerProfile
    {
        return SellerProfile::find($id);
    }

    public function updateStatus(int $id, string $status, ?string $rejectReason = null): bool
    {
        $profile = $this->findById($id);
        if (!$profile) {
            return false;
        }

        $profile->status = $status;
        if ($status === SellerProfileStatus::REJECTED->value) {
            $profile->reject_reason = $rejectReason;
        } else {
            $profile->reject_reason = null;
        }

        return $profile->save();
    }
}
