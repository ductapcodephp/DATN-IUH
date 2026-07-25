<?php

namespace App\Services\Admin;

use App\Repositories\Admin\AdminReportRepository;

class ReportService
{
    protected $repository;

    public function __construct(AdminReportRepository $repository)
    {
        $this->repository = $repository;
    }
}
