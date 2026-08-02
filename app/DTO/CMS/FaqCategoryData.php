<?php

namespace App\DTO\CMS;

use Illuminate\Http\Request;

class FaqCategoryData
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $icon,
        public readonly ?string $color,
        public readonly int $sort_order,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->name,
            icon: $request->icon,
            color: $request->color,
            sort_order: $request->input('sort_order', 0),
        );
    }
}
