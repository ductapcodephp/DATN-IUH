<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Course\Chapters;

use Illuminate\Foundation\Http\FormRequest;

class StoreChapterRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');

        return auth()->check() && (int) $course->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
        ];
    }
}