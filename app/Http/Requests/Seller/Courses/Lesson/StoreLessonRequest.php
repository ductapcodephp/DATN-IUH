<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');
        $chapter = $this->route('chapter');

        $isSellerCourse = auth()->check() && (int) $course->seller_id === (int) auth()->id();
        $isChapterInCourse = (int) $chapter->course_id === (int) $course->id;

        return $isSellerCourse && $isChapterInCourse;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type'  => ['required', 'string', 'in:video,document,quiz_only'],
        ];
    }
}
