<?php

declare(strict_types=1);

namespace App\DTO\Course\Lesson;

use Illuminate\Http\Request;

readonly class ReorderQuestionData
{
    /**
     * @param int[] $questionIds
     */
    public function __construct(
        public array $questionIds,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            questionIds: array_map('intval', (array) $request->input('question_ids', [])),
        );
    }
}