<?php

namespace App\Http\Controllers\Admin;

use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Services\Admin\WithdrawalService;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    protected $service;

    public function __construct(WithdrawalService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $withdrawals = WithdrawalRequest::with('user')->orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Withdrawals', [
            'withdrawals' => $withdrawals
        ]);
    }

    public function approve(Request $request, $id)
    {
        $request->validate([
            'admin_note' => 'nullable|string|max:500'
        ]);

        try {
            $this->service->approve($id, $request->admin_note);
            return back()->with('success', 'Đã duyệt yêu cầu rút tiền thành công.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500'
        ], [
            'admin_note.required' => 'Vui lòng nhập lý do từ chối.'
        ]);

        try {
            $this->service->reject($id, $request->admin_note);
            return back()->with('success', 'Đã từ chối yêu cầu rút tiền và hoàn tiền lại cho giảng viên.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
