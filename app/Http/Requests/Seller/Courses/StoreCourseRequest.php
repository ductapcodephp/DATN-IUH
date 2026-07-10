<?php

namespace App\Http\Requests\Seller\Courses;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We use controller middleware or custom logic to authorize
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'status' => 'required|in:published,draft,hidden',
            'level' => 'required|in:beginner,intermediate,advanced',
            'is_free' => 'nullable|boolean',
            'is_vip' => 'nullable|boolean',
            'price' => 'nullable|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}
