<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class ReorderLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');

        return auth()->check() && (int) $course->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        return [
            'lesson_id'         => ['required', 'integer', 'exists:lessons,id'],
            'target_chapter_id' => ['required', 'integer', 'exists:chapters,id'],
            'sorted_ids'        => ['required', 'array', 'min:1'],
            'sorted_ids.*'      => ['required', 'integer', 'exists:lessons,id'],
        ];
    }
}
