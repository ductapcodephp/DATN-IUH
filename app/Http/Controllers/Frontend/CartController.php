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
     * Lấy danh sách mã giảm giá VIP chưa sử dụng của user
     */
    private function getVipCouponsForUser(?int $userId): array
    {
        if (! $userId) {
            return [];
        }

        return Coupon::where('is_vip_coupon', true)
            ->where('user_id_owner', $userId)
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')
                    ->orWhereRaw('used_count < max_uses');
            })
            ->whereDoesntHave('usages', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }
}
