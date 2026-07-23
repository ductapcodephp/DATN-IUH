<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Quizzes;

use App\Models\QuizQuestion;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $questionId = (int) $this->route('questionId');
        $question = QuizQuestion::with('quiz.lesson.course')->find($questionId);

        if (! $question || ! $question->quiz?->lesson?->course) {
            return false;
        }

        return auth()->check() && (int) $question->quiz->lesson->course->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        return [
            'question_text' => ['required', 'string'],
            'type' => ['required', 'in:single_choice,multiple_choice'],
            'answers' => ['required', 'array', 'min:2'],
            'answers.*.text' => ['required', 'string'],
            'answers.*.is_correct' => ['required', 'boolean'],
        ];
    }
}
