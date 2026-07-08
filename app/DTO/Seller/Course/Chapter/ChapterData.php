<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Chapter;

use Illuminate\Http\Request;

readonly class ChapterData
{
    public function __construct(
        public string $title,
        public bool $isPublished = true,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: trim((string) $request->input('title')),
            isPublished: $request->boolean('is_published', true),
        );
    }
}
