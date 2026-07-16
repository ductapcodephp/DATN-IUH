<?php

namespace App\Http\Requests\Frontend\Wishlist;

use Illuminate\Foundation\Http\FormRequest;

class ToggleWishlistRequest extends FormRequest
{
 
    public function authorize(): bool
    {
        return true;
    }

   
    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
        ];
    }
}
