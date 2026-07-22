<?php

declare(strict_types=1);

namespace App\DTO\Seller\Student;

use Illuminate\Http\Request;

readonly class BanStudentData
{
    public function __construct(
        public ?string $reason,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            reason: $request->filled('reason') ? trim((string) $request->input('reason')) : null,
        );
    }
}
