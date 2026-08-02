<?php

namespace App\Repositories\CMS\Block;

use App\Models\CoreBlockContent;
use App\Models\CorePage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BlockRepository implements BlockRepositoryInterface
{
    public function getBlocksByPageId(int $pageId): Collection
    {
        $page = CorePage::findOrFail($pageId);
        
        return CoreBlockContent::where('post_id', $page->post_id)
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function findById(int $id): ?CoreBlockContent
    {
        return CoreBlockContent::findOrFail($id);
    }

    public function store(array $data, int $postId): CoreBlockContent
    {
        // Get max sort_order
        $maxSort = CoreBlockContent::where('post_id', $postId)->max('sort_order') ?? 0;
        
        $data['post_id'] = $postId;
        $data['sort_order'] = $maxSort + 1;
        $data['status'] = $data['status'] ?? 'active';

        return CoreBlockContent::create($data);
    }

    public function update(CoreBlockContent $block, array $data): CoreBlockContent
    {
        $block->update($data);
        return $block;
    }

    public function delete(CoreBlockContent $block): void
    {
        $block->delete();
    }

    public function updateSortOrders(array $sortData): void
    {
        DB::transaction(function () use ($sortData) {
            foreach ($sortData as $item) {
                CoreBlockContent::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });
    }



    /**
     * Thêm 1 item mới vào listingItem trong content JSON
     * Port từ ismart2026 /cms/block/{id}/add-item
     */
    public function addListingItem(CoreBlockContent $block, array $itemData): CoreBlockContent
    {
        $content = is_array($block->content) ? $block->content : [];
        
        if (!isset($content['listingItem'])) {
            $content['listingItem'] = [];
        }
        
        $content['listingItem'][] = $itemData;
        $block->content = $content;
        $block->save();
        
        return $block;
    }

    /**
     * Xóa 1 item khỏi listingItem theo index
     */
    public function removeListingItem(CoreBlockContent $block, int $index): CoreBlockContent
    {
        $content = is_array($block->content) ? $block->content : [];
        
        if (isset($content['listingItem'][$index])) {
            array_splice($content['listingItem'], $index, 1);
            $block->content = $content;
            $block->save();
        }
        
        return $block;
    }

    /**
     * Update 1 property đơn lẻ (hoặc nested key trong content JSON)
     * Port từ ismart2026 /cms/block/edit/by-property/{id}
     */
    public function updateProperty(CoreBlockContent $block, string $property, mixed $value): CoreBlockContent
    {
        // Check nếu property là SQL column trực tiếp
        if (in_array($property, $block->getFillable())) {
            $block->{$property} = $value;
            $block->save();
            return $block;
        }
        
        // Nếu không, treat như nested key trong content JSON
        $content = is_array($block->content) ? $block->content : [];
        \Illuminate\Support\Arr::set($content, $property, $value);
        
        $block->content = $content;
        $block->save();
        
        return $block;
    }
}
