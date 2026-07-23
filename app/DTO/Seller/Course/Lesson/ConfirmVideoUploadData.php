<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

use Illuminate\Http\Request;

readonly class ConfirmVideoUploadData
{
    public function __construct(
        public string $r2Key,
        public int $durationSeconds,
        public int $sizeBytes,
        public string $mimeType,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            r2Key: $request->input('key'),
            durationSeconds: (int) $request->input('duration_seconds'),
            sizeBytes: (int) $request->input('size_bytes'),
            mimeType: $request->input('mime_type'),
        );
    }
}
