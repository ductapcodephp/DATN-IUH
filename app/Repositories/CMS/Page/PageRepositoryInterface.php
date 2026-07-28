<?php

namespace App\Repositories\CMS\Page;

use App\DTO\CMS\PageData;
use App\Models\CorePage;
use Illuminate\Pagination\LengthAwarePaginator;

interface PageRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function store(PageData $data): CorePage;
    public function findById(int $id): ?CorePage;
    public function update(CorePage $page, PageData $data): CorePage;
    public function delete(CorePage $page): void;
}
