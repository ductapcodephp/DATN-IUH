<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVipPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'badge_text' => 'nullable|string|max:50',
            'package_type' => 'required|string',
            'role_type' => 'required|in:user,seller',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'priority_level' => 'nullable|integer',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'max_storage_gb' => 'nullable|integer|min:1'
        ];
    }
}
