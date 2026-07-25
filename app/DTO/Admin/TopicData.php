<?php

declare(strict_types=1);

namespace App\DTO\Admin;

use Illuminate\Http\Request;

readonly class TopicData
{
    public function __construct(
        public string $name,
        public string $type,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: (string) $request->input('name'),
            type: (string) $request->input('type'),
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
        ];
    }
}
