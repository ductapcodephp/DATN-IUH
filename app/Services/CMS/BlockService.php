<?php

namespace App\Services\CMS;

use App\Models\CoreBlockContent;
use App\Models\CorePage;
use App\Repositories\CMS\Block\BlockRepositoryInterface;
use Illuminate\Support\Collection;

class BlockService
{
    public function __construct(
        private readonly BlockRepositoryInterface $blockRepository
    ) {
    }

    public function getBlocksByPageId(int $pageId): Collection
    {
        return $this->blockRepository->getBlocksByPageId($pageId);
    }

    public function createBlockForPage(int $pageId, array $data): CoreBlockContent
    {
        $page = CorePage::findOrFail($pageId);
        return $this->blockRepository->store($data, $page->post_id);
    }

    public function updateBlock(int $id, array $data): CoreBlockContent
    {
        $block = $this->blockRepository->findById($id);
        return $this->blockRepository->update($block, $data);
    }

    public function deleteBlock(int $id): void
    {
        $block = $this->blockRepository->findById($id);
        $this->blockRepository->delete($block);
    }

    public function reorderBlocks(array $sortData): void
    {
        $this->blockRepository->updateSortOrders($sortData);
    }
}
