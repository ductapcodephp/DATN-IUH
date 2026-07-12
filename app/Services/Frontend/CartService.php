<?php

namespace App\Services\Frontend;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class CartService
{
    public function getCart()
    {
        $userId = Auth::id();
        if (!$userId) return [];

        $cart = Cart::with('items.course')->firstOrCreate(['user_id' => $userId]);

        return $cart->items->map(function ($item) {
            return [
                'id' => $item->course->id,
                'title' => $item->course->title,
                'price' => $item->course->price,
                'original_price' => $item->course->original_price,
                'thumbnail' => $item->course->thumbnail,
                'slug' => $item->course->slug,
            ];
        })->toArray();
    }

    public function addToCart($courseId)
    {
        $userId = Auth::id();
        if (!$userId) return false;

        $course = Course::find($courseId);
        if (!$course) return false;

        $cart = Cart::firstOrCreate(['user_id' => $userId]);

        $exists = CartItem::where('cart_id', $cart->id)->where('course_id', $courseId)->exists();
        if ($exists) {
            return false;
        }

        CartItem::create([
            'cart_id' => $cart->id,
            'course_id' => $course->id,
            'price' => $course->price,
        ]);

        return true;
    }

    public function removeFromCart($courseId)
    {
        $userId = Auth::id();
        if (!$userId) return false;

        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) return false;

        CartItem::where('cart_id', $cart->id)->where('course_id', $courseId)->delete();

        return true;
    }

    public function clearCart()
    {
        $userId = Auth::id();
        if ($userId) {
            $cart = Cart::where('user_id', $userId)->first();
            if ($cart) {
                $cart->items()->delete();
            }
        }
    }
}
