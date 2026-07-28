<?php

namespace App\Repositories\SellerProfile;

use App\Models\SellerProfile;
use Illuminate\Database\Eloquent\Collection;

interface SellerProfileRepositoryInterface
{
    /**
     * Get seller profile by user ID
     */
    public function findByUserId(int $userId): ?SellerProfile;

    /**
     * Create or update seller profile
     */
    public function updateOrCreate(int $userId, array $data): SellerProfile;

    /**
     * Get list of pending seller profiles
     */
    public function getPendingProfiles(): Collection;

    /**
     * Find profile by ID
     */
    public function findById(int $id): ?SellerProfile;

    /**
     * Update profile status
     */
    public function updateStatus(int $id, string $status, ?string $rejectReason = null): bool;
}
