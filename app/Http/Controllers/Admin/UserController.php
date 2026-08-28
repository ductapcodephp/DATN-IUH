<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Admin\UserService;
use App\DTO\Admin\UserFilterData;
use App\DTO\Admin\CreateUserData;
use App\DTO\Admin\UserChartFilterData;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filterData = UserFilterData::fromRequest($request->all());
        
        $users = $this->service->getPaginatedUsers($filterData);
        $roles = $this->service->getDistinctRoles();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status', 'role'])
        ]);
    }

    public function toggleStatus($id)
    {
        $result = $this->service->toggleStatus($id);
        
        if (!$result['success']) {
            return redirect()->back()->with('error', $result['message']);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'current_role' => 'required|in:seller,user',
        ]);

        $createData = CreateUserData::fromRequest($request->all());
        $this->service->createUser($createData);

        return redirect()->back()->with('success', 'Người dùng đã được tạo thành công.');
    }

    public function show(Request $request, $id)
    {
        $userDetails = $this->service->getUserDetails($id);
        
        $chartFilterData = UserChartFilterData::fromRequest($request->all());
        $chartData = $this->service->getUserChartData($id, $chartFilterData);

        return Inertia::render('Admin/UserDetail', [
            'user' => $userDetails['user'],
            'stats' => $userDetails['stats'],
            'chartData' => $chartData,
            'filters' => [
                'type' => $chartFilterData->type,
                'start_date' => $chartFilterData->startDate,
                'end_date' => $chartFilterData->endDate
            ],
            'orders' => $userDetails['orders'],
        ]);
    }

    public function getChartData(Request $request, $id)
    {
        $chartFilterData = UserChartFilterData::fromRequest($request->all());
        return response()->json($this->service->getUserChartData($id, $chartFilterData));
    }

    public function export(Request $request, $id)
    {
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }
        
        $orders = $this->service->getExportOrdersData($id, $filters);
        $user = $this->service->getUserDetails($id)['user'];
        
        $filename = "bao_cao_nguoi_dung_{$id}_" . date('Ymd_His') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($orders, $user) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8 Excel support
            fputs($file, $bom = (chr(0xEF) . chr(0xBB) . chr(0xBF)));

            fputcsv($file, ['Mã Đơn Hàng', 'Khóa Học/Dịch Vụ', 'Số Tiền (VNĐ)', 'Trạng Thái', 'Ngày Giao Dịch']);

            foreach ($orders as $order) {
                $itemName = $order->course ? $order->course->title : ($order->vipPackage ? $order->vipPackage->name : 'N/A');
                fputcsv($file, [
                    $order->id,
                    $itemName,
                    $order->amount_paid,
                    $order->status,
                    $order->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
