<?php

declare(strict_types=1);

namespace App\DTO\Course\Lesson;

use Illuminate\Http\Request;

readonly class ReorderLessonData
{
    public function __construct(
        public int $lessonId,
        public int $targetChapterId,
        /** @var int[] */
        public array $sortedIds,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            lessonId: (int) $request->input('lesson_id'),
            targetChapterId: (int) $request->input('target_chapter_id'),
            sortedIds: array_map('intval', (array) $request->input('sorted_ids', [])),
        );
    }
}