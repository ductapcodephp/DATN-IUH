<?php

namespace App\Http\Requests\Frontend\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class BankAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bank_name' => 'required|string|max:100',
            'account_name' => 'required|string|max:150',
            'account_number' => 'required|string|max:50',
            'branch' => 'nullable|string|max:200',
            'is_default' => 'boolean',
        ];
    }
}
