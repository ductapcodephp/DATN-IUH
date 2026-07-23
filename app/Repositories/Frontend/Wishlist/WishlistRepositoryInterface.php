<?php

namespace App\Repositories\Frontend\Wishlist;

use Illuminate\Database\Eloquent\Collection;

interface WishlistRepositoryInterface
{
    /**
     * Get wishlisted courses for a specific user.
     *
     * @return Collection
     */
    public function getWishlistCoursesByUserId(int $userId);

    /**
     * Toggle a course in user's wishlist.
     *
     * @return array
     */
    public function toggleWishlist(int $userId, int $courseId);
}
