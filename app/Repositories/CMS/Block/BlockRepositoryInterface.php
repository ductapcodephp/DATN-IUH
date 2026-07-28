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
}
