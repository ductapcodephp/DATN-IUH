<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Students;

use Illuminate\Foundation\Http\FormRequest;

class StudentIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'course_id' => ['nullable'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
