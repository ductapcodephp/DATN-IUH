<?php

namespace App\DTO\Frontend\AI;

use Illuminate\Http\Request;

readonly class AIChatData
{
    public function __construct(
        public string $question
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            question: $request->input('question', '')
        );
    }
}
