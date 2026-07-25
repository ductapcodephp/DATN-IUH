<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ReportService;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $service;

    public function __construct(ReportService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $reports = \App\Models\Report::with('reporter')->orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Reports', [
            'reports' => $reports
        ]);
    }
}
