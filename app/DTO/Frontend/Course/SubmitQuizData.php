<?php

namespace App\DTO\Frontend\Course;

use Illuminate\Http\Request;

readonly class SubmitQuizData
{
    public function __construct(
        public array $answers
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            answers: $request->input('answers', [])
        );
    }
}
