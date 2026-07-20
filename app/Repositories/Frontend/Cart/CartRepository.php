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
            $platformCoupons = Coupon::whereNull('seller_id')
                ->active()
                ->validNow()
                ->available()
                ->get();
                
            return [
                'courseCoupons' => collect(),
                'instructorCoupons' => collect(),
                'platformCoupons' => $platformCoupons
            ];
        }

        $course = Course::select('id', 'seller_id')->findOrFail((int) $courseId);
        
        // Tách ra 3 truy vấn độc lập và gộp lại cho cực kỳ dễ hiểu theo đúng ý sếp:
        
        // 1. Mã giảm giá CHỈ DÀNH RIÊNG cho khóa học này (của đúng giảng viên này)
        $courseCoupons = Coupon::where('course_id', $courseId)
            ->where('seller_id', $course->seller_id)
            ->active()->validNow()->available()->get();

        // 2. Mã giảm giá áp dụng TOÀN BỘ KHÓA HỌC của giảng viên này
        $sellerCoupons = Coupon::whereNull('course_id')
            ->where('seller_id', $course->seller_id)
            ->active()->validNow()->available()->get();

        // 3. Mã giảm giá TOÀN SÀN của hệ thống (KHÔNG TRẢ VỀ Ở ĐÂY NỮA VÌ NÓ THUỘC MODAL KHÁC)
        // Sếp đã nhắc: "2 cái modal mở ra khác nhau nha mày không chung dữ liệu"
        
        // Trả về mảng riêng rẽ
        return [
            'courseCoupons' => $courseCoupons,
            'instructorCoupons' => $sellerCoupons,
            'platformCoupons' => collect() // Trả mảng rỗng để không lọt mã toàn sàn vào modal của khóa học
        ];
    }
    
}
