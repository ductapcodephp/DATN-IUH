<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $service;

    public function __construct(DashboardService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        $stats = $this->service->getStats($filters);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    public function getChartData(Request $request)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        return response()->json($this->service->getChartData($filters));
    }

    public function export(Request $request)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        
        $orders = $this->service->getExportOrdersData($filters);
        
        $filename = "bao_cao_doanh_thu_" . date('Ymd_His') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($orders) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8 Excel support
            fputs($file, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

            fputcsv($file, ['Mã Đơn Hàng', 'Tên Khách Hàng', 'Email Khách Hàng', 'Tiền Gốc (VNĐ)', 'Hoa Hồng (VNĐ)', 'Đã Trừ (VNĐ)', 'Trạng Thái', 'Ngày Giao Dịch']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->user ? $order->user->name : 'N/A',
                    $order->user ? $order->user->email : 'N/A',
                    $order->amount_paid ?? 0,
                    $order->commission_amount ?? 0,
                    $order->seller_amount ?? 0,
                    $order->status,
                    $order->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
