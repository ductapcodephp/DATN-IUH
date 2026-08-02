<?php

namespace App\DTO\CMS;

use Illuminate\Http\Request;

class FaqData
{
    public function __construct(
        public readonly ?int $category_id,
        public readonly string $question,
        public readonly string $answer,
        public readonly bool $is_active,
        public readonly int $sort_order,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            category_id: $request->category_id,
            question: $request->question,
            answer: $request->answer,
            is_active: $request->has('is_active') ? $request->boolean('is_active') : true,
            sort_order: $request->input('sort_order', 0),
        );
    }
}
