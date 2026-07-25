<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminUserRepository;

class UserService
{
    protected $repository;

    public function __construct(AdminUserRepository $repository)
    {
        $this->repository = $repository;
    }
}
