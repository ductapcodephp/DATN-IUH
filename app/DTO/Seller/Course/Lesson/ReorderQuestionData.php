<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

use App\Http\Requests\Seller\Courses\Quizzes\ReorderQuizQuestionsRequest;

readonly class ReorderQuestionData
{
    /**
     * @param int[] $questionIds
     */
    public function __construct(
        public array $questionIds,
    ) {}

    public static function fromRequest(ReorderQuizQuestionsRequest $request): self
    {
        return new self(
            questionIds: array_map('intval', (array) $request->input('question_ids', [])),
        );
    }
}
