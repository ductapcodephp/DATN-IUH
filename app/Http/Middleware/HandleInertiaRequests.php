<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Tên của file blade gốc (thường là resources/views/app.blade.php)
     */
    protected $rootView = 'app';

    /**
     * Xác định version của asset để tự động reload lại React khi có code mới
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Những dữ liệu này sẽ được truyền ra toàn bộ các trang React (Global props)
     */
    public function share(Request $request): array
    {
        // Dùng array_merge để gộp props mặc định của Inertia với props của mình
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(), // Lấy user hiện tại đang đăng nhập
                'wishlisted_course_ids' => $request->user() 
                    ? \App\Models\Wishlist::where('user_id', $request->user()->id)->pluck('course_id')->toArray() 
                    : [],
            ],
            // Truyền lỗi hoặc thông báo thành công ra React
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'system' => fn () => $request->session()->get('errors') ? $request->session()->get('errors')->first('system') : null,
            ],
        ]);
    }
}
