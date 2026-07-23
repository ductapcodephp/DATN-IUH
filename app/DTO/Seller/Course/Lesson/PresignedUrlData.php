<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

use Illuminate\Http\Request;

readonly class PresignedUrlData
{
    public function __construct(
        public string $extension,
        public int $sizeBytes,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            extension: $request->input('extension', 'mp4'),
            sizeBytes: (int) $request->input('size_bytes', 0),
        );
    }
}
