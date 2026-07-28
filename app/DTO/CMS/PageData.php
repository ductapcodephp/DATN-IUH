<?php

namespace App\DTO\CMS;

use Illuminate\Http\Request;

readonly class PageData
{
    public function __construct(
        public string $name,
        public string $title,
        public ?string $slug = null,
        public ?string $sub_title = null,
        public ?string $description = null,
        public ?string $content = null,
        public ?string $thumbnail = null,
        public ?string $published = 'publish',
        public ?array $tags = null,
        public ?string $language = 'vi',
        public ?string $css = null,
        public ?string $custom_css = null,
        public ?string $google_title = null,
        public ?string $google_description = null,
        public ?string $facebook_title = null,
        public ?string $facebook_description = null,
        public ?string $facebook_thumbnail = null,
        public ?array $google_tag = null,
        public int $is_hot = 0,
        public int $is_new = 0,
        public bool $keep_slug = true
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->input('name', ''),
            title: $request->input('title', ''),
            slug: $request->input('slug'),
            sub_title: $request->input('sub_title'),
            description: $request->input('description'),
            content: $request->input('content'),
            thumbnail: $request->input('thumbnail'),
            published: $request->input('published', 'publish'),
            tags: $request->input('tags', []),
            language: $request->input('language', 'vi'),
            css: $request->input('css'),
            custom_css: $request->input('custom_css'),
            google_title: $request->input('google_title'),
            google_description: $request->input('google_description'),
            facebook_title: $request->input('facebook_title'),
            facebook_description: $request->input('facebook_description'),
            facebook_thumbnail: $request->input('facebook_thumbnail'),
            google_tag: $request->input('google_tag', []),
            is_hot: (int) $request->input('is_hot', 0),
            is_new: (int) $request->input('is_new', 0),
            keep_slug: (bool) $request->input('keep_slug', true)
        );
    }
}
