<?php

namespace App\DTO\Frontend\Course;

use Illuminate\Http\Request;

readonly class VideoProgressData
{
    public function __construct(
        public float $watchedSeconds,
        public float $durationSeconds,
        public float $skippedSeconds = 0
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            watchedSeconds: (float) $request->input('watched_seconds', 0),
            durationSeconds: (float) $request->input('duration_seconds', 0),
            skippedSeconds: (float) $request->input('skipped_seconds', 0)
        );
    }
}
