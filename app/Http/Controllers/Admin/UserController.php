<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\UserService;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\User::whereNotIn('current_role', [\App\Enums\UserRole::ROOT, \App\Enums\UserRole::ADMIN]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status);
        }

        if ($request->filled('role')) {
            $query->where('current_role', $request->role);
        }

        $users = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();
            
        $roles = \App\Models\User::whereNotIn('current_role', [\App\Enums\UserRole::ROOT, \App\Enums\UserRole::ADMIN])
            ->select('current_role')
            ->distinct()
            ->pluck('current_role');

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'status', 'role'])
        ]);
    }

    public function toggleStatus($id)
    {
        $user = \App\Models\User::findOrFail($id);
        
        // Prevent root admin from being blocked (optional safety)
        if ($user->current_role === \App\Enums\UserRole::ROOT) {
            return redirect()->back()->with('error', 'Không thể khóa tài khoản Root Admin.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->back()->with('success', 'Đã cập nhật trạng thái người dùng.');
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'current_role' => 'required|in:seller,user',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'current_role' => $request->current_role,
            'roles' => [$request->current_role],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Người dùng đã được tạo thành công.');
    }
    public function show(\Illuminate\Http\Request $request, $id)
    {
        $user = \App\Models\User::with(['vipSubscriptions.vipPackage'])->findOrFail($id);

        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }

        $stats = [];
        $chartData = $this->getChartDataLogic($user, $filters);

        if ($user->current_role === \App\Enums\UserRole::USER) {
            $stats['total_spent'] = \App\Models\Order::where('user_id', $user->id)->where('status', 'completed')->sum('amount_paid');
            $stats['total_courses'] = \App\Models\CourseEnrollment::where('student_id', $user->id)->count();
            $stats['total_vips'] = \App\Models\VipSubscription::where('user_id', $user->id)->count();
        } else {
            // Seller
            $stats['total_revenue'] = \App\Models\DailyStatistic::where('seller_id', $user->id)->sum('total_revenue');
            $stats['total_courses'] = \App\Models\Course::where('seller_id', $user->id)->count();
            $stats['total_students'] = \App\Models\CourseEnrollment::where('seller_id', $user->id)->count();
        }

        $orders = \App\Models\Order::with(['course', 'vipPackage'])
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/UserDetail', [
            'user' => $user,
            'stats' => $stats,
            'chartData' => $chartData,
            'filters' => $filters,
            'orders' => $orders,
        ]);
    }

    public function getChartData(\Illuminate\Http\Request $request, $id)
    {
        $user = \App\Models\User::findOrFail($id);
        $filters = $request->only(['type', 'start_date', 'end_date']);
        if (empty($filters['type']) && empty($filters['start_date'])) {
            $filters['type'] = 'week';
        }

        return response()->json($this->getChartDataLogic($user, $filters));
    }

    protected function getChartDataLogic($user, $filters)
    {
        $type = $filters['type'] ?? 'week';
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        $isUser = $user->current_role === \App\Enums\UserRole::USER;

        if ($isUser) {
            $query = \App\Models\Order::where('user_id', $user->id)->where('status', 'completed');
            $dateCol = 'created_at';
            $valCol = 'amount_paid';
        } else {
            $query = \App\Models\DailyStatistic::where('seller_id', $user->id);
            $dateCol = 'date';
            $valCol = 'total_revenue';
        }

        if ($startDate && $endDate) {
            if ($isUser) {
                $query->whereBetween('created_at', [\Illuminate\Support\Carbon::parse($startDate)->startOfDay(), \Illuminate\Support\Carbon::parse($endDate)->endOfDay()]);
            } else {
                $query->whereBetween('date', [\Illuminate\Support\Carbon::parse($startDate)->format('Y-m-d'), \Illuminate\Support\Carbon::parse($endDate)->format('Y-m-d')]);
            }
            
            $revenues = $query->select(
                \Illuminate\Support\Facades\DB::raw("DATE($dateCol) as d"),
                \Illuminate\Support\Facades\DB::raw("SUM($valCol) as total")
            )->groupBy('d')->orderBy('d', 'asc')->get()->keyBy('d');

            $chartData = ['labels' => [], 'data' => []];
            $period = \Carbon\CarbonPeriod::create($startDate, $endDate);
            foreach ($period as $date) {
                $d = $date->format('Y-m-d');
                $chartData['labels'][] = $date->format('d/m');
                $chartData['data'][] = isset($revenues[$d]) ? (float) $revenues[$d]->total : 0;
            }
            return $chartData;
        }

        switch ($type) {
            case 'week':
                $start = \Illuminate\Support\Carbon::now()->subDays(6)->startOfDay();
                if ($isUser) {
                    $query->where('created_at', '>=', $start);
                } else {
                    $query->where('date', '>=', $start->format('Y-m-d'));
                }
                
                $revenues = $query->select(\Illuminate\Support\Facades\DB::raw("DATE($dateCol) as d"), \Illuminate\Support\Facades\DB::raw("SUM($valCol) as total"))
                    ->groupBy('d')->orderBy('d', 'asc')->get()->keyBy('d');
                
                $chartData = ['labels' => [], 'data' => []];
                for ($i = 0; $i < 7; $i++) {
                    $date = $start->copy()->addDays($i)->format('Y-m-d');
                    $chartData['labels'][] = \Illuminate\Support\Carbon::parse($date)->format('d/m');
                    $chartData['data'][] = isset($revenues[$date]) ? (float) $revenues[$date]->total : 0;
                }
                break;

            case 'month':
                $start = \Illuminate\Support\Carbon::now()->startOfMonth();
                $end = \Illuminate\Support\Carbon::now()->endOfMonth();
                if ($isUser) {
                    $query->whereBetween('created_at', [$start, $end]);
                } else {
                    $query->whereBetween('date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
                }
                
                $revenues = $query->select(\Illuminate\Support\Facades\DB::raw("DATE($dateCol) as d"), \Illuminate\Support\Facades\DB::raw("SUM($valCol) as total"))
                    ->groupBy('d')->orderBy('d', 'asc')->get()->keyBy('d');
                
                $chartData = ['labels' => [], 'data' => []];
                $daysInMonth = \Illuminate\Support\Carbon::now()->daysInMonth;
                for ($i = 0; $i < $daysInMonth; $i++) {
                    $date = $start->copy()->addDays($i)->format('Y-m-d');
                    $chartData['labels'][] = \Illuminate\Support\Carbon::parse($date)->format('d/m');
                    $chartData['data'][] = isset($revenues[$date]) ? (float) $revenues[$date]->total : 0;
                }
                break;

            case 'year':
                $start = \Illuminate\Support\Carbon::now()->startOfYear();
                $end = \Illuminate\Support\Carbon::now()->endOfYear();
                if ($isUser) {
                    $query->whereBetween('created_at', [$start, $end]);
                } else {
                    $query->whereBetween('date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);
                }
                
                $revenues = $query->select(\Illuminate\Support\Facades\DB::raw("MONTH($dateCol) as m"), \Illuminate\Support\Facades\DB::raw("SUM($valCol) as total"))
                    ->groupBy('m')->orderBy('m', 'asc')->get()->keyBy('m');
                
                $chartData = ['labels' => [], 'data' => []];
                for ($i = 1; $i <= 12; $i++) {
                    $chartData['labels'][] = "Tháng " . $i;
                    $chartData['data'][] = isset($revenues[$i]) ? (float) $revenues[$i]->total : 0;
                }
                break;

            default:
                $chartData = ['labels' => [], 'data' => []];
                break;
        }

        return $chartData;
    }
}
