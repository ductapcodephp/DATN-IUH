<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

readonly class QuestionAnswerData
{
    public function __construct(
        public string $text,
        public bool $isCorrect,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            text: trim((string) ($data['text'] ?? $data['answer'] ?? '')),
            isCorrect: (bool) ($data['is_correct'] ?? false),
        );
    }
}
