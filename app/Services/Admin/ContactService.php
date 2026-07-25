<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminContactRepository;

class ContactService
{
    protected $repository;

    public function __construct(AdminContactRepository $repository)
    {
        $this->repository = $repository;
    }
}
