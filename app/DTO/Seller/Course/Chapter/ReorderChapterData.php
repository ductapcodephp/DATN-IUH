<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Chapter;

use Illuminate\Http\Request;

readonly class ReorderChapterData
{
    public function __construct(
        /** @var int[] */
        public array $ids,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            ids: array_map('intval', (array) $request->input('ids', [])),
        );
    }
}
