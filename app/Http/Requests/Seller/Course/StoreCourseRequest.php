<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Kiểm tra quyền: Đã đăng nhập và đang ở vai trò Seller
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->current_role === 'seller';
    }

    /**
     * Luật kiểm tra dữ liệu khi tạo mới
     */
    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'status'      => ['required', 'in:draft,published,hidden'],
            'level'       => ['required', 'in:beginner,intermediate,advanced'],
            'price'       => ['nullable', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'thumbnail'   => ['nullable', 'image', 'max:2048'],
        ];
    }
}