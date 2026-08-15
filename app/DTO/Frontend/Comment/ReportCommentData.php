<?php

declare(strict_types=1);

namespace App\DTO\Frontend\Comment;

use Illuminate\Http\Request;

readonly class ReportCommentData
{
    public function __construct(
        public string $reason,
        public ?string $details = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            reason: (string) $request->input('reason'),
            details: $request->input('details') ? (string) $request->input('details') : null,
        );
    }

    public function toArray(): array
    {
        return [
            'reason' => $this->reason,
            'details' => $this->details,
        ];
    }
}
