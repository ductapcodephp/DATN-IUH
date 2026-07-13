<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Wishlist\ToggleWishlistRequest;
use App\Services\Frontend\WishlistService;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    protected $wishlistService;

    public function __construct(WishlistService $wishlistService)
    {
        $this->wishlistService = $wishlistService;
    }

    public function toggle(ToggleWishlistRequest $request)
    {
        $userId = Auth::id();
        $courseId = $request->course_id;

        $result = $this->wishlistService->toggleWishlist($userId, $courseId);

        return redirect()->back()->with('success', $result['message']);
    }

    public function index()
    {
        $courses = $this->wishlistService->getWishlistCourses(Auth::id());

        return \Inertia\Inertia::render('Frontend/Wishlist/Index', [
            'wishlistCourses' => $courses
        ]);
    }
}
