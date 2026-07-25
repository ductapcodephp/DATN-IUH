<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminWithdrawalRepository;

class WithdrawalService
{
    protected $repository;

    public function __construct(AdminWithdrawalRepository $repository)
    {
        $this->repository = $repository;
    }

    public function approve($id, $adminNote = null)
    {
        return $this->repository->approve($id, $adminNote);
    }

    public function reject($id, $adminNote = null)
    {
        return $this->repository->reject($id, $adminNote);
    }
}
