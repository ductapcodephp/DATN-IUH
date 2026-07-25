<?php

namespace App\Http\Controllers\Admin;

use App\Models\Report;
use App\Http\Controllers\Controller;
use App\Services\Admin\ReportService;
use Inertia\Inertia;
use App\Events\ReportResolved;
use App\Events\ReportDismissed;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $service;

    public function __construct(ReportService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $reports = Report::with(['reporter', 'reportable'])->orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Reports', [
            'reports' => $reports
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['reporter', 'reportable'])->findOrFail($id);
        
        $type = class_basename($report->reportable_type);
        if ($report->reportable) {
            if ($type === 'Review') {
                $report->reportable->load(['user', 'course']);
            } elseif ($type === 'Comment') {
                $report->reportable->load('user');
            }
        }

        return Inertia::render('Admin/ReportDetail', [
            'report' => $report
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $request->validate(['reason' => 'nullable|string']);
        $report = Report::with(['reporter', 'reportable'])->findOrFail($id);
        
        if ($report->status !== 'pending') {
            return back()->with('error', 'Báo cáo này đã được xử lý.');
        }

        $type = class_basename($report->reportable_type);

        if ($report->reportable) {
            if ($type === 'Review' || $type === 'Comment') {
                if (method_exists($report->reportable, 'forceDelete')) {
                    $report->reportable->forceDelete(); 
                } else {
                    $report->reportable->delete();
                }
            } else {
                $report->reportable->delete(); 
            }
        }

        $report->status = 'reviewed';
        $report->save();

        if ($type === 'Course') {
            $owner = $report->reportable->seller ?? null;
            if ($owner && $owner->email) {
                event(new ReportResolved($report, $owner->email, $request->reason));
            }
        }

        return back()->with('success', 'Đã xử lý báo cáo và gỡ bỏ nội dung thành công.');
    }

    public function dismiss(Request $request, $id)
    {
        $request->validate(['reason' => 'nullable|string']);
        
        $report = Report::with(['reporter'])->findOrFail($id);

        if ($report->status !== 'pending') {
            return back()->with('error', 'Báo cáo này đã được xử lý.');
        }

        $report->status = 'dismissed';
        $report->save();

        $type = class_basename($report->reportable_type);
        if ($type === 'Course') {
            if ($report->reporter && $report->reporter->email) {
                event(new ReportDismissed($report, $report->reporter->email, $request->reason));
            }
        }

        return back()->with('success', 'Đã từ chối báo cáo.');
    }
}
