<?php

declare(strict_types=1);

namespace App\Http\Requests\Seller\Courses\Quizzes;
use App\Models\Lesson;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuizQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $routeParam = $this->route('lesson');
        $lesson = $routeParam instanceof Lesson ? $routeParam : Lesson::with('course')->find((int) $routeParam);

        if (!$lesson || !$lesson->course) {
            return false;
        }

        return auth()->check() && (int) $lesson->course->seller_id === (int) auth()->id();
    }

    public function rules(): array
    {
        return [
            'question_text'        => ['required', 'string'],
            'type'                 => ['required', 'in:single_choice,multiple_choice'],
            'answers'              => ['required', 'array', 'min:2'],
            'answers.*.text'       => ['required', 'string'],
            'answers.*.is_correct' => ['required', 'boolean'],
        ];
    }
}
