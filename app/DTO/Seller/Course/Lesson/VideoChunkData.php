<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course\Lesson;

use Illuminate\Http\Request;

readonly class VideoChunkData
{
    public function __construct(
        public int $chunkIndex,
        public int $totalChunks,
        public string $fileUid,
        public string $filename,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            chunkIndex: (int) $request->input('chunk_index'),
            totalChunks: (int) $request->input('total_chunks'),
            fileUid: trim((string) $request->input('file_uid')),
            filename: trim((string) $request->input('filename')),
        );
    }
}
