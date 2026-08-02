<?php

namespace App\Repositories\CMS\Block;

use App\Models\CoreBlockContent;
use App\Models\CorePage;
use Illuminate\Support\Collection;

interface BlockRepositoryInterface
{
    public function getBlocksByPageId(int $pageId): Collection;
    public function store(array $data, int $postId): CoreBlockContent;
    public function findById(int $id): ?CoreBlockContent;
    public function update(CoreBlockContent $block, array $data): CoreBlockContent;
    public function delete(CoreBlockContent $block): void;
    public function updateSortOrders(array $sortData): void;



    /**
     * Thêm 1 item mới vào listingItem trong content JSON
     */
    public function addListingItem(CoreBlockContent $block, array $itemData): CoreBlockContent;

    /**
     * Xóa 1 item khỏi listingItem theo index
     */
    public function removeListingItem(CoreBlockContent $block, int $index): CoreBlockContent;

    /**
     * Update 1 property đơn lẻ (hoặc nested key trong content JSON)
     */
    public function updateProperty(CoreBlockContent $block, string $property, mixed $value): CoreBlockContent;
}
