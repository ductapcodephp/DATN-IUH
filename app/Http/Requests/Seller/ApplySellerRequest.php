<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class ApplySellerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'headline' => ['required', 'string', 'max:255'],
            'bio' => ['required', 'string'],
            'website' => ['nullable', 'url', 'max:255'],
            'tax_number' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['required', 'string', 'max:255'],
            'bank_account_number' => ['required', 'string', 'max:50'],
            'bank_account_name' => ['required', 'string', 'max:255'],
        ];

        // If creating new or didn't upload before, ID cards are required
        // We'll just make them sometimes optional if updating
        if ($this->isMethod('post')) {
            $rules['identity_card_front'] = ['required', 'image', 'max:5120'];
            $rules['identity_card_back'] = ['required', 'image', 'max:5120'];
        } else {
            $rules['identity_card_front'] = ['nullable', 'image', 'max:5120'];
            $rules['identity_card_back'] = ['nullable', 'image', 'max:5120'];
        }

        return $rules;
    }
}
