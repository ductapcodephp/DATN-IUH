<?php

namespace App\DTO\CMS;

use Illuminate\Http\Request;

class MenuData
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $url,
        public readonly ?string $icon,
        public readonly ?string $position,
        public readonly ?int $parent_id,
        public readonly string $display,
        public readonly int $sort_order,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->name,
            url: $request->url,
            icon: $request->icon,
            position: $request->position,
            parent_id: $request->parent_id ?: null,
            display: $request->display ?? 'show',
            sort_order: $request->sort_order ?? 0,
        );
    }
}
