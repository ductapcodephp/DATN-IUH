<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Quizzes;

use App\Models\Lesson;
use Illuminate\Foundation\Http\FormRequest;

class ReorderQuizQuestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $lesson = $this->route('lesson');

        if (!$lesson instanceof Lesson) {
            return false;
        }

        $course = $lesson->course;

        return auth()->check() && $course && (int) $course->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        return [
            'question_ids'   => ['required', 'array', 'min:1'],
            'question_ids.*' => ['required', 'integer', 'exists:quiz_questions,id'],
        ];
    }
}
