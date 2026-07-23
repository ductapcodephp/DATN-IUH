<?php

namespace App\Services\Frontend;

use App\DTO\Frontend\Cart\CartItemData;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Repositories\Frontend\Cart\CartRepositoryInterface;
use Exception;

class CartService
{
    protected $cartRepository;

    public function __construct(CartRepositoryInterface $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function getCartDataForUser(int $userId)
    {
        $cart = $this->cartRepository->getCartByUserId($userId);
        $cartItems = $this->cartRepository->getCartItemsWithRelations($cart->id, ['course.seller', 'course.category']);

        return [
            'cart' => $cart,
            'cartItems' => $cartItems,
            'totalAmount' => $cartItems->sum('price'),
        ];
    }

    public function addCourseToCart(CartItemData $dto)
    {
        $cart = $this->cartRepository->getCartByUserId($dto->userId);

        $existingItem = $this->cartRepository->findItemInCart($cart->id, $dto->courseId);

        if ($existingItem) {
            throw new Exception('Khóa học này đã có trong giỏ hàng.');
        }

        return $this->cartRepository->addItemToCart($cart->id, $dto->courseId, $dto->price);
    }

    public function removeCourseFromCart(int $cartItemId, int $userId)
    {
        $cartItem = $this->cartRepository->getCartItemById($cartItemId);

        if (! $cartItem) {
            throw new Exception('Không tìm thấy khóa học trong giỏ hàng.');
        }

        if ($cartItem->cart->user_id !== $userId) {
            throw new Exception('Bạn không có quyền xóa khóa học này.');
        }

        return $this->cartRepository->removeItemFromCart($cartItemId);
    }

    public function getCouponForCourse($courseId)
    {
        return $this->cartRepository->getCouponForCourse($courseId);
    }

    public function calculateDiscountForCart($cartItems, array $codes)
    {
        $discountAmount = 0;
        $validCoupons = [];

        $coupons = Coupon::whereIn('code', $codes)->active()->get();

        if ($coupons->isEmpty() && ! empty($codes)) {
            throw new Exception('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }

        $totalAmount = $cartItems->sum('price');
        $userId = auth()->id();

        foreach ($coupons as $coupon) {
            if (! $coupon->isValid()) {
                throw new Exception("Mã {$coupon->code} đã hết hạn hoặc hết lượt dùng.");
            }

            if ($userId) {
                $hasUsed = CouponUsage::where('coupon_id', $coupon->id)
                    ->where('user_id', $userId)
                    ->exists();
                if ($hasUsed) {
                    throw new Exception("Mã {$coupon->code} đã được bạn sử dụng trước đó. Mỗi tài khoản chỉ được dùng 1 lần.");
                }
            }

            if ($coupon->course_id) {
                $cartItem = $cartItems->firstWhere('course_id', $coupon->course_id);
                if (! $cartItem) {
                    throw new Exception("Mã {$coupon->code} không áp dụng cho các khóa học trong giỏ hàng.");
                }
                $itemPrice = $cartItem->price;
                $discount = $coupon->calculateDiscount($itemPrice);
                $discount = min($discount, $itemPrice);

                $discountAmount += $discount;
                $validCoupons[] = $coupon;
            } elseif ($coupon->seller_id) {
                $sellerItemsTotal = $cartItems->filter(function ($item) use ($coupon) {
                    return $item->course && $item->course->seller_id === $coupon->seller_id;
                })->sum('price');

                if ($sellerItemsTotal == 0) {
                    throw new Exception("Mã {$coupon->code} không áp dụng cho giảng viên của các khóa học này.");
                }

                $discount = $coupon->calculateDiscount($sellerItemsTotal);
                $discount = min($discount, $sellerItemsTotal);

                $discountAmount += $discount;
                $validCoupons[] = $coupon;
            } else {
                $discount = $coupon->calculateDiscount($totalAmount);
                $discount = min($discount, $totalAmount);

                $discountAmount += $discount;
                $validCoupons[] = $coupon;
            }
        }

        $discountAmount = min($discountAmount, $totalAmount);

        return [
            'discountAmount' => $discountAmount,
            'validCoupons' => $validCoupons,
        ];
    }

    public function clearCart(int $userId)
    {
        $cart = $this->cartRepository->getCartByUserId($userId);
        if ($cart) {
            $cart->items()->delete();
        }
    }
}
