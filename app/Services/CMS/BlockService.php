<?php

namespace App\Services\CMS;

use App\DTO\CMS\BlockData;
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

    public function getBlockById(int $id): ?CoreBlockContent
    {
        return $this->blockRepository->findById($id);
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


    /**
     * Update block với DTO và tự động sync nếu là static block
     */
    public function updateBlockWithDTO(int $id, BlockData $dto): CoreBlockContent
    {
        $block = $this->blockRepository->findById($id);
        $dto->applyTo($block);
        $block->save();

        return $block;
    }

    /**
     * Thêm item vào listingItem trong content
     */
    public function addItemToBlock(int $blockId, array $itemData): CoreBlockContent
    {
        $block = $this->blockRepository->findById($blockId);
        return $this->blockRepository->addListingItem($block, $itemData);
    }

    /**
     * Xóa item khỏi listingItem
     */
    public function removeItemFromBlock(int $blockId, int $index): CoreBlockContent
    {
        $block = $this->blockRepository->findById($blockId);
        return $this->blockRepository->removeListingItem($block, $index);
    }

    /**
     * Update 1 property đơn lẻ (inline edit)
     */
    public function updateBlockProperty(int $id, string $property, mixed $value): CoreBlockContent
    {
        $block = $this->blockRepository->findById($id);
        $updated = $this->blockRepository->updateProperty($block, $property, $value);

        return $updated;
    }

    public function getPageForBlock(CoreBlockContent $block): ?CorePage
    {
        return CorePage::where('post_id', $block->post_id)->first();
    }

    public function getExtraDataForBlock(CoreBlockContent $block): array
    {
        $extraData = [];
        if (in_array($block->type, ['home_featured_courses', 'home_instructor_section'])) {
            $homeService = app(\App\Services\Frontend\HomeService::class);
            if ($block->type === 'home_featured_courses') {
                $extraData['courses'] = $homeService->getSponsoredCourses();
                $extraData['enrolledCourseIds'] = auth()->check() ? \App\Models\CourseEnrollment::where('student_id', auth()->id())->pluck('course_id')->toArray() : [];
            }
            if ($block->type === 'home_instructor_section') {
                $extraData['instructors'] = $homeService->getTopInstructors();
            }
        }
        return $extraData;
    }
}
