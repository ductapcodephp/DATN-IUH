<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Video;

use Illuminate\Foundation\Http\FormRequest;

class CheckVideoChunksRequest extends FormRequest
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
            'file_uid' => ['nullable', 'string', 'max:255'],
        ];
    }
}
