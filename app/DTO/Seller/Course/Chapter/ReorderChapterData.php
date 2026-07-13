<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Chapter;

use App\Http\Requests\Seller\Courses\Chapters\ReorderChapterRequest;

readonly class ReorderChapterData
{
    public function __construct(
        /** @var int[] */
        public array $ids,
    ) {}

    public static function fromRequest(ReorderChapterRequest $request): self
    {
        return new self(
            ids: array_map('intval', (array) $request->input('ids', [])),
        );
    }
}
