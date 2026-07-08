<?php

declare(strict_types=1);

namespace App\DTO\Course\Lesson;

use Illuminate\Http\Request;

readonly class UpdateLessonData
{
    public function __construct(
        public ?string $title,
        public ?string $description,
        public ?bool $isPreview,
        public ?bool $isPublished,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->has('title') ? trim((string) $request->input('title')) : null,
            description: $request->has('description') ? trim((string) $request->input('description')) : null,
            isPreview: $request->has('is_preview') ? $request->boolean('is_preview') : null,
            isPublished: $request->has('is_published') ? $request->boolean('is_published') : null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'title'        => $this->title,
            'description'  => $this->description,
            'is_preview'   => $this->isPreview,
            'is_published' => $this->isPublished,
        ], fn ($value) => !is_null($value));
    }
}