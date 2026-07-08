<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Course\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');
        $lesson = $this->route('lesson');

        $isSellerCourse = auth()->check() && (int) $course->seller_id === (int) auth()->id();
        $isLessonInCourse = (int) $lesson->course_id === (int) $course->id;

        return $isSellerCourse && $isLessonInCourse;
    }

    public function rules(): array
    {
        return [
            'title'        => ['sometimes', 'required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'is_preview'   => ['sometimes', 'required', 'boolean'],
            'is_published' => ['sometimes', 'required', 'boolean'],
        ];
    }
}
