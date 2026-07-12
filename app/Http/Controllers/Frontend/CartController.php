<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        $cart = $this->cartService->getCart();
        return Inertia::render('Frontend/Cart/Index', [
            'cartItems' => array_values($cart)
        ]);
    }

    public function add(Request $request)
    {
        $request->validate(['course_id' => 'required|integer']);
        
        $added = $this->cartService->addToCart($request->course_id);
        
        if ($added) {
            return back()->with('success', 'Đã thêm khóa học vào giỏ hàng');
        }
        return back()->with('error', 'Khóa học đã có trong giỏ hàng hoặc không tồn tại');
    }

    public function remove(Request $request)
    {
        $request->validate(['course_id' => 'required|integer']);
        
        $this->cartService->removeFromCart($request->course_id);
        
        return back()->with('success', 'Đã xóa khóa học khỏi giỏ hàng');
    }
}
