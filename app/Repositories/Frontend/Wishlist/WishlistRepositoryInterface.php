<?php

namespace App\Repositories\Frontend\Wishlist;

interface WishlistRepositoryInterface
{
    /**
     * Get wishlisted courses for a specific user.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWishlistCoursesByUserId(int $userId);

    /**
     * Toggle a course in user's wishlist.
     *
     * @param int $userId
     * @param int $courseId
     * @return array
     */
    public function toggleWishlist(int $userId, int $courseId);
}
