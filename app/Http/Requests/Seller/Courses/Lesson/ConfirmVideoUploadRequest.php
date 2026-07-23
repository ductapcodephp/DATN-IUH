<?php

namespace App\Http\Requests\Seller\Courses\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmVideoUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string',
            'duration_seconds' => 'required|integer',
            'size_bytes' => 'required|integer',
            'mime_type' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'key.required' => 'Thiếu đường dẫn (key) của file video trên Cloudflare.',
            'duration_seconds.required' => 'Không thể đọc được thời lượng của video.',
            'duration_seconds.integer' => 'Thời lượng video phải là một số nguyên.',
            'size_bytes.required' => 'Thiếu thông tin dung lượng file.',
            'size_bytes.integer' => 'Dung lượng file phải là một số nguyên.',
            'mime_type.required' => 'Thiếu định dạng file (mime_type).',
        ];
    }
}
