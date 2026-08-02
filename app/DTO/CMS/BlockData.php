<?php

namespace App\DTO\CMS;

use App\Models\CoreBlockContent;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

readonly class BlockData
{
    public function __construct(
        public ?string $title = null,
        public ?string $sub_title = null,
        public ?string $description = null,
        public ?int $sort_order = null,
        public ?string $background = null,
        public ?string $mobile_background = null,
        public ?string $image = null,
        public ?string $image_mobile = null,
        public ?string $image_icon = null,
        public ?string $text_icon = null,
        public ?string $url = null,
        public ?string $video_url = null,
        public ?string $location = null,
        public ?string $button = null,
        public ?string $thumbnail = null,
        public ?string $status = null,
        public ?string $type = null,
        public ?string $language = null,

        public ?array $config = null,
        public ?array $content = null,
        public ?array $listing_item = null,
        public ?array $listing_item_extra = null,
        public ?array $extra = null,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->input('title'),
            sub_title: $request->input('sub_title'),
            description: $request->input('description'),
            sort_order: $request->input('sort_order') !== null ? (int) $request->input('sort_order') : null,
            background: $request->input('background'),
            mobile_background: $request->input('mobile_background'),
            image: $request->input('image'),
            image_mobile: $request->input('image_mobile'),
            image_icon: $request->input('image_icon'),
            text_icon: $request->input('text_icon'),
            url: $request->input('url'),
            video_url: $request->input('video_url'),
            location: $request->input('location'),
            button: $request->input('button'),
            thumbnail: $request->input('thumbnail'),
            status: $request->input('status'),
            type: $request->input('type'),
            language: $request->input('language'),

            config: $request->input('config'),
            content: $request->input('content'),
            listing_item: $request->input('listing_item'),
            listing_item_extra: $request->input('listing_item_extra'),
            extra: $request->input('extra'),
        );
    }

    public function applyTo(CoreBlockContent $block): CoreBlockContent
    {
        $attributes = [
            'title' => $this->title,
            'sub_title' => $this->sub_title,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'background' => $this->background,
            'mobile_background' => $this->mobile_background,
            'image' => $this->image,
            'image_mobile' => $this->image_mobile,
            'image_icon' => $this->image_icon,
            'text_icon' => $this->text_icon,
            'url' => $this->url,
            'video_url' => $this->video_url,
            'location' => $this->location,
            'button' => $this->button,
            'thumbnail' => $this->thumbnail,
            'status' => $this->status,
            'type' => $this->type,
            'language' => $this->language,
        ];

        foreach ($attributes as $key => $value) {
            if ($value !== null) {
                $block->{$key} = $value;
            }
        }

        if ($this->config !== null) {
            $existingConfig = is_array($block->config) ? $block->config : [];
            $block->config = array_merge($existingConfig, $this->config);
        }

        $blockContent = is_array($block->content) ? $block->content : [];

        if ($this->content !== null) {
            $blockContent = array_merge($blockContent, $this->content);
        }

        $blockContent = $this->mergeListingData($blockContent, 'listingItem', $this->listing_item);
        $blockContent = $this->mergeListingData($blockContent, 'listingItemExtra', $this->listing_item_extra);
        $blockContent = $this->mergeExtraData($blockContent, $this->extra);

        $block->content = $blockContent;

        return $block;
    }

    private function mergeListingData(array $content, string $key, ?array $listingData): array
    {
        if ($listingData === null) {
            return $content;
        }

        $merge = $listingData['merge'] ?? false;
        unset($listingData['merge']);

        $items = $listingData['items'] ?? $listingData;
        
        // Convert to sequential array in case keys were provided or altered
        $items = array_values($items);

        if ($merge && isset($content[$key]) && is_array($content[$key])) {
            $content[$key] = array_merge($content[$key], $items);
        } else {
            $content[$key] = $items;
        }

        return $content;
    }

    private function mergeExtraData(array $content, ?array $extra): array
    {
        if ($extra === null) {
            return $content;
        }

        foreach ($extra as $key => $value) {
            Arr::set($content, $key, $value);
        }

        return $content;
    }
}
