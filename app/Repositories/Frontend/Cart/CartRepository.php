<?php

namespace App\Repositories\Frontend\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Course;
class CartRepository implements CartRepositoryInterface
{
    public function getCartByUserId(int $userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function findItemInCart(int $cartId, int $courseId)
    {
        return CartItem::where('cart_id', $cartId)->where('course_id', $courseId)->first();
    }

    public function addItemToCart(int $cartId, int $courseId, float|int $price)
    {
        return CartItem::create([
            'cart_id' => $cartId,
            'course_id' => $courseId,
            'price' => $price
        ]);
    }

    public function getCartItemById(int $cartItemId)
    {
        return CartItem::with('cart')->find($cartItemId);
    }

    public function removeItemFromCart(int $cartItemId)
    {
        return CartItem::where('id', $cartItemId)->delete();
    }

    public function getCartItemsWithRelations(int $cartId, array $relations = [])
    {
        return CartItem::where('cart_id', $cartId)->with($relations)->get();
    }

    public function getCouponForCourse($courseId)
    {
        if ($courseId === 'all') {
            // Lấy voucher toàn sàn (seller_id = null)
            return Coupon::whereNull('seller_id')
                ->active()
                ->validNow()
                ->get();
        }

        $course = Course::select('id', 'seller_id')->findOrFail((int) $courseId);
        
        // Lấy voucher của khóa học này (course_id = $courseId) 
        // HOẶC voucher toàn khóa học của giảng viên này (course_id = null, seller_id = $course->seller_id)
        // HOẶC voucher toàn sàn (seller_id = null)
        return Coupon::where(function ($query) use ($course, $courseId) {
            $query->where('seller_id', $course->seller_id)
                  ->where(function ($q) use ($courseId) {
                      $q->where('course_id', $courseId)
                        ->orWhereNull('course_id');
                  });
        })->orWhereNull('seller_id') // Voucher toàn sàn
        ->active()
        ->validNow()
        ->get();
    }
    
}
