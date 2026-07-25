<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminVipPackageRepository;

class VipPackageService
{
    protected $repository;

    public function __construct(AdminVipPackageRepository $repository)
    {
        $this->repository = $repository;
    }
}
