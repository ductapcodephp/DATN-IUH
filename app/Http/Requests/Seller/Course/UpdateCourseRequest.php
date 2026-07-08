<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    /**
     * Kiểm tra quyền: Người dùng có phải là chủ sở hữu của khóa học đang sửa không?
     */
    public function authorize(): bool
    {
        // Lấy model Course từ route (truyền qua URL seller/courses/{course})
        $course = $this->route('course');

        return auth()->check() && (int) $course->seller_id === (int) auth()->id();
    }

    /**
     * Luật kiểm tra dữ liệu khi cập nhật
     */
    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'level'       => ['required', 'in:beginner,intermediate,advanced'],
            'status'      => ['required', 'in:draft,published,hidden'],
            'thumbnail'   => ['nullable', 'image', 'max:2048'],
        ];
    }
}