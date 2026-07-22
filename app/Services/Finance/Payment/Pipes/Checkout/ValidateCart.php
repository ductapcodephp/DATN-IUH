<?php

namespace App\Services\Finance\Payment\Pipes\Checkout;

use App\DTO\Payment\CheckoutData;
use App\Services\Frontend\CartService;
use App\Models\CourseEnrollment;
use Closure;
use Exception;

class ValidateCart
{
    public function __construct(protected CartService $cartService) {}

    /**
     * Validate giỏ hàng: kiểm tra không rỗng và không chứa khóa học đã sở hữu.
     */
    public function handle(CheckoutData $data, Closure $next)
    {
        $cartData = $this->cartService->getCartDataForUser($data->userId);

        if ($cartData['cartItems']->isEmpty()) {
            throw new Exception('Giỏ hàng trống.');
        }

        $courseIds = $cartData['cartItems']->pluck('course_id')->toArray();
        $alreadyEnrolled = CourseEnrollment::where('student_id', $data->userId)
            ->whereIn('course_id', $courseIds)
            ->exists();

        if ($alreadyEnrolled) {
            throw new Exception('Trong giỏ hàng có khóa học bạn đã sở hữu.');
        }

        $data->cartItems = $cartData['cartItems'];
        $data->totalAmount = $cartData['totalAmount'];

        return $next($data);
    }
}
