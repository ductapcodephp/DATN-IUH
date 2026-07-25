<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminSettingRepository;

class SettingService
{
    protected $repository;

    public function __construct(AdminSettingRepository $repository)
    {
        $this->repository = $repository;
    }
}
