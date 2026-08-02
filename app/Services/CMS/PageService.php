<?php

namespace App\Services\CMS;

use App\DTO\CMS\PageData;
use App\Models\CorePage;
use App\Repositories\CMS\Page\PageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class PageService
{
    public function __construct(
        private readonly PageRepositoryInterface $pageRepository
    ) {
    }

    public function getPaginatedPages(int $perPage = 10): LengthAwarePaginator
    {
        return $this->pageRepository->paginate($perPage);
    }

    public function getPageById(int $id): ?CorePage
    {
        return $this->pageRepository->findById($id);
    }

    public function createPage(PageData $data): CorePage
    {
        return $this->pageRepository->store($data);
    }

    public function updatePage(int $id, PageData $data): CorePage
    {
        $page = $this->pageRepository->findById($id);
        return $this->pageRepository->update($page, $data);
    }

    public function deletePage(int $id): void
    {
        $page = $this->pageRepository->findById($id);
        $this->pageRepository->delete($page);
    }
}
