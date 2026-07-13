<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Course;
use App\Services\Frontend\CourseService;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index()
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        
        $cartItems = $cart->items()->with(['course.seller'])->get();
        $totalAmount = $cartItems->sum('price');
        
        $popularCourses = $this->courseService->getPopularCourses(4);

        return Inertia::render('Frontend/Cart/Index', [
            'cart' => $cart,
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'popularCourses' => $popularCourses
        ]);
    }

    public function add(Request $request, Course $course)
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // Check if item already exists in cart
        if ($cart->items()->where('course_id', $course->id)->exists()) {
            return back()->with('error', 'Khóa học này đã có trong giỏ hàng.');
        }

        // Add to cart
        $cart->items()->create([
            'course_id' => $course->id,
            'price' => $course->price
        ]);

        return back()->with('success', 'Đã thêm khóa học vào giỏ hàng.');
    }

    public function remove(CartItem $cartItem)
    {
        // Ensure user owns this cart item
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Đã xóa khóa học khỏi giỏ hàng.');
    }
}
