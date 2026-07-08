<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

use Illuminate\Http\Request;

readonly class StoreQuestionData
{
    /**
     * @param QuestionAnswerData[] $answers
     */
    public function __construct(
        public string $questionText,
        public string $type,
        public array $answers,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $rawAnswers = (array) $request->input('answers', []);
        $answers = array_map(
            fn (array $ans) => QuestionAnswerData::fromArray($ans),
            $rawAnswers
        );

        return new self(
            questionText: trim((string) $request->input('question_text')),
            type: trim((string) $request->input('type')),
            answers: $answers,
        );
    }
}
