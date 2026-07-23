<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Video;

use Illuminate\Foundation\Http\FormRequest;

class UploadVideoChunkRequest extends FormRequest
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
            'video_chunk' => ['required', 'file'],
            'chunk_index' => ['required', 'integer', 'min:0'],
            'total_chunks' => ['required', 'integer', 'min:1'],
            'file_uid' => ['required', 'string', 'max:255'],
            'filename' => ['required', 'string', 'max:255'],
        ];
    }
}
