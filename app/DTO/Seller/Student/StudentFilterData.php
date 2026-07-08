<?php

declare(strict_types=1);

namespace App\DTO\Seller\Student;

use Illuminate\Http\Request;

readonly class StudentFilterData
{
    public function __construct(
        public ?string $search,
        public mixed $courseId,
        public int $perPage,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            search: $request->filled('search') ? trim((string) $request->input('search')) : null,
            courseId: $request->input('course_id'),
            perPage: (int) $request->input('per_page', 10),
        );
    }

    public function toArray(): array
    {
        return [
            'search'    => $this->search,
            'course_id' => $this->courseId,
            'per_page'  => $this->perPage,
        ];
    }
}