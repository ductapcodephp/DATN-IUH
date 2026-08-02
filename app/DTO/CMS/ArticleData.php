<?php

namespace App\DTO\CMS;

class ArticleData
{
    public function __construct(
        public readonly string $title,
        public readonly string $published,
        public readonly string $language,
        public readonly ?int $categoryId = null,
        public readonly ?string $slug = null,
        public readonly ?string $subTitle = null,
        public readonly ?string $thumbnail = null,
        public readonly ?string $description = null,
        public readonly ?string $content = null,
        public readonly bool $isHot = false,
        public readonly bool $isNew = false,
    ) {
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self(
            title: $request->input('title'),
            published: $request->input('published'),
            language: $request->input('language'),
            categoryId: $request->input('category_id'),
            slug: $request->input('slug'),
            subTitle: $request->input('sub_title'),
            thumbnail: $request->input('thumbnail'),
            description: $request->input('description'),
            content: $request->input('content'),
            isHot: (bool) $request->input('is_hot'),
            isNew: (bool) $request->input('is_new'),
        );
    }
}
