<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Course;
use App\Services\Frontend\CourseService;
use App\Services\Frontend\CartService;
use App\DTO\Frontend\Cart\CartItemData;
use Illuminate\Support\Facades\Auth;
use Exception;

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
        
        if (!empty($appliedCoupons)) {
            try {
                $discountResult = $this->cartService->calculateDiscountForCart($cartData['cartItems'], $appliedCoupons);
                $discountAmount = $discountResult['discountAmount'];
                $validCoupons = $discountResult['validCoupons'];
            } catch (Exception $e) {
                // Ignore error on render, let users re-apply if needed
            }
        }

        $popularCourses = $this->courseService->getPopularCourses(4);
        return Inertia::render('Frontend/Cart/Index', [
            'cart' => $cartData['cart'],
            'cartItems' => $cartData['cartItems'],
            'totalAmount' => $cartData['totalAmount'],
            'popularCourses' => $popularCourses,
            'discountAmount' => $discountAmount,
            'appliedCoupons' => $validCoupons,
            'availableCoupons' => Inertia::lazy(function () use ($request) {
                if ($courseId = $request->input('course_id')) {
                    return $this->cartService->getCouponForCourse($courseId);
                }
                return [];
            })
        ]);
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

    public function getCouponForCourse(Course $course)
    {
        return $this->cartService->getCouponForCourse($course->id);
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
            // Kiểm tra tính hợp lệ, nếu ném lỗi thì sẽ bị catch và thông báo
            $this->cartService->calculateDiscountForCart($cartData['cartItems'], $codes);
            
            session(['applied_coupons' => $codes]);
            
            return back()->with('success', 'Đã áp dụng mã giảm giá thành công.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

}
