<?php

namespace App\DTO\Admin;

class UserFilterData
{
    public function __construct(
        public readonly ?string $search,
        public readonly ?string $status,
        public readonly ?string $role
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            $data['search'] ?? null,
            $data['status'] ?? null,
            $data['role'] ?? null
        );
    }
}
