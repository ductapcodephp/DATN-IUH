<?php

namespace App\Http\Controllers\Frontend;

use App\DTO\Frontend\Cart\CartItemData;
use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Course;
use App\Services\Frontend\CartService;
use App\Services\Frontend\CourseService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $courseService;

    protected $cartService;

    public function __construct(CourseService $courseService, CartService $cartService)
    {
        $this->courseService = $courseService;
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $cartData = $this->cartService->getCartDataForUser(Auth::id());
        $appliedCoupons = session('applied_coupons', []);

        $discountAmount = 0;
        $validCoupons = [];

        if (! empty($appliedCoupons)) {
            try {
                $discountResult = $this->cartService->calculateDiscountForCart($cartData['cartItems'], $appliedCoupons);
                $discountAmount = $discountResult['discountAmount'];
                $validCoupons = $discountResult['validCoupons'];
            } catch (Exception $e) {
                // Ignore error on render, let users re-apply if needed
            }
        }

        $popularCourses = $this->courseService->getPopularCourses(4);

        $renderData = [
            'cart' => $cartData['cart'],
            'cartItems' => $cartData['cartItems'],
            'totalAmount' => $cartData['totalAmount'],
            'popularCourses' => $popularCourses,
            'discountAmount' => $discountAmount,
            'appliedCoupons' => $validCoupons,
            'courseCoupons' => Inertia::lazy(function () use ($request) {
                if ($courseId = $request->input('course_id')) {
                    $res = $this->cartService->getCouponForCourse($courseId);

                    return $res['courseCoupons'] ?? [];
                }

                return [];
            }),
            'instructorCoupons' => Inertia::lazy(function () use ($request) {
                if ($courseId = $request->input('course_id')) {
                    $res = $this->cartService->getCouponForCourse($courseId);

                    return $res['instructorCoupons'] ?? [];
                }

                return [];
            }),
            'platformCoupons' => Inertia::lazy(function () use ($request) {
                if ($courseId = $request->input('course_id')) {
                    $res = $this->cartService->getCouponForCourse($courseId);

                    return $res['platformCoupons'] ?? [];
                }

                return [];
            }),
            'vipCoupons' => $this->getVipCouponsForUser(Auth::id()),
        ];
        
        $pageData = app(\App\Http\Controllers\Frontend\PageController::class)->getPageData('gio-hang');
        if ($pageData) {
            $renderData = array_merge($renderData, $pageData);
        }

        return Inertia::render('Frontend/Cart/Index', $renderData);
    }

    public function add(Request $request, Course $course)
    {
        try {
            $dto = CartItemData::fromCourse(Auth::id(), $course);
            $this->cartService->addCourseToCart($dto);

            return back()->with('success', 'Đã thêm khóa học vào giỏ hàng.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function remove($cartItem)
    {
        try {
            $cartItemId = is_numeric($cartItem) ? $cartItem : $cartItem->id;
            $this->cartService->removeCourseFromCart((int) $cartItemId, Auth::id());

            return back()->with('success', 'Đã xóa khóa học khỏi giỏ hàng.');
        } catch (Exception $e) {
            abort(403, $e->getMessage());
        }
    }

    public function applyCoupons(Request $request)
    {
        $codes = $request->input('codes', []);

        if (empty($codes)) {
            session()->forget('applied_coupons');

            return back()->with('success', 'Đã gỡ mã giảm giá.');
        }

        try {
            $cartData = $this->cartService->getCartDataForUser(Auth::id());
            $this->cartService->calculateDiscountForCart($cartData['cartItems'], $codes);

            session(['applied_coupons' => $codes]);

            return back()->with('success', 'Đã áp dụng mã giảm giá thành công.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Lấy danh sách mã giảm giá VIP đã phát cho user (chưa sử dụng)
     */
    private function getVipCouponsForUser(?int $userId): array
    {
        if (! $userId) {
            return [];
        }

        return \App\Models\DistributedCoupon::with('coupon')
            ->where('user_id', $userId)
            ->where('is_used', false)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            })
            ->orderBy('distributed_at', 'desc')
            ->get()
            ->map(function ($dc) {
                $coupon = $dc->coupon;

                return [
                    'id' => $dc->id,
                    'code' => $dc->code,
                    'type' => $coupon->type ?? 'percent',
                    'value' => $coupon->value ?? 0,
                    'min_order_amount' => $coupon->min_order_amount ?? 0,
                    'max_discount_amount' => $coupon->max_discount_amount ?? null,
                    'course_id' => $coupon->course_id ?? null,
                    'seller_id' => null,
                    'expires_at' => $dc->expires_at?->toISOString(),
                    'is_vip' => true,
                ];
            })
            ->toArray();
    }
}
