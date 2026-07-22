<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Students;

use Illuminate\Foundation\Http\FormRequest;

class BanStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
