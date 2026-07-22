<?php

declare(strict_types=1);

namespace App\DTO\Seller\Course;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

readonly class CourseData
{
    public function __construct(
        public string $title,
        public string $status,
        public string $level,
        public bool $isFree,
        public bool $isVip,
        public ?float $price,
        public ?float $originalPrice,
        public string $description,
        public array $requirements,
        public array $outcomes,
        public ?UploadedFile $thumbnail = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $parseLines = fn (?string $text) => array_filter(
            array_map('trim', explode("\n", str_replace("\r", '', (string) $text)))
        );

        return new self(
            title: $request->input('title'),
            status: $request->input('status', 'draft'),
            level: $request->input('level', 'beginner'),
            isFree: $request->boolean('is_free'),
            isVip: $request->boolean('is_vip'),
            price: $request->boolean('is_free') ? 0 : (float) $request->input('price'),
            originalPrice: $request->boolean('is_free') ? null : (float) $request->input('original_price'),
            description: $request->input('description'),
            requirements: $parseLines($request->input('requirements')),
            outcomes: $parseLines($request->input('outcomes')),
            thumbnail: $request->file('thumbnail'),
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'status' => $this->status,
            'level' => $this->level,
            'is_free' => $this->isFree,
            'is_vip' => $this->isVip,
            'price' => $this->price,
            'original_price' => $this->originalPrice,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'outcomes' => $this->outcomes,
        ];
    }
}
