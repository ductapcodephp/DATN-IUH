<?php

namespace App\Services\Frontend;

use App\Repositories\Frontend\Wishlist\WishlistRepositoryInterface;

class WishlistService
{
    protected $wishlistRepository;

    public function __construct(WishlistRepositoryInterface $wishlistRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
    }

    public function getWishlistCourses(int $userId)
    {
        return $this->wishlistRepository->getWishlistCoursesByUserId($userId);
    }

    public function toggleWishlist(int $userId, int $courseId)
    {
        return $this->wishlistRepository->toggleWishlist($userId, $courseId);
    }
}
