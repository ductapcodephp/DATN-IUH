<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
            'phone' => ['nullable', 'string', 'regex:/^([0-9\s\-\+\(\)]*)$/', 'min:10'],
            'role' => ['required', 'string', 'in:user,seller'],
            'referred_by_code' => ['nullable', 'string', 'exists:users,referral_code'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'Vai trò đăng ký không hợp lệ.',
            'password.min' => 'Mật khẩu phải từ 8 ký tự trở lên.',
        ];
    }
}
