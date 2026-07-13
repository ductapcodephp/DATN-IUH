<?php

namespace App\Repositories\Frontend\Wishlist;

use App\Models\Course;
use App\Models\Wishlist;

class WishlistRepository implements WishlistRepositoryInterface
{
    public function getWishlistCoursesByUserId(int $userId)
    {
        return Course::whereHas('wishlists', function($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->with(['category', 'seller'])
        ->withAvg('reviews', 'rating')
        ->withCount('students')
        ->get();
    }

    public function toggleWishlist(int $userId, int $courseId)
    {
        $wishlist = Wishlist::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return ['status' => 'removed', 'message' => 'Đã xóa khỏi danh sách yêu thích.'];
        } else {
            Wishlist::create([
                'user_id' => $userId,
                'course_id' => $courseId,
            ]);
            return ['status' => 'added', 'message' => 'Đã thêm vào danh sách yêu thích.'];
        }
    }
}
