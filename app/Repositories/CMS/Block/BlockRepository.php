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
}
