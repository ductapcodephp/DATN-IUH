<?php

namespace App\DTO\Admin;

class CreateUserData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly string $current_role
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            $data['name'],
            $data['email'],
            $data['password'],
            $data['current_role']
        );
    }
}
