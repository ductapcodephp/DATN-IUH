<?php

namespace App\Http\Requests\Frontend\Dashboard;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'   => 'sometimes|nullable|string|max:255',
            'phone'  => 'sometimes|nullable|string|max:20',
            'bio'    => 'sometimes|nullable|string|max:1000',
            'avatar' => 'sometimes|nullable|image|max:2048',
        ];
    }
}
