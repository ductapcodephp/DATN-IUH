<?php

namespace App\DTO\CMS;

use Illuminate\Http\Request;

class CategoryData
{
    public function __construct(
        public readonly string $name,
        public readonly bool $is_active,
        public readonly int $sort_order,
        public readonly ?string $icon,
        public readonly ?string $color,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->name,
            is_active: $request->is_active ?? true,
            sort_order: $request->sort_order ?? 0,
            icon: $request->icon,
            color: $request->color,
        );
    }
}
