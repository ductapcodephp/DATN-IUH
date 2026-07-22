<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\Finance\WalletService;
use App\DTO\Finance\WithdrawalData;

class RevenueController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function index(Request $request)
    {
        $userId = Auth::id();
        $wallet = $this->walletService->getWalletInfo($userId);
        $totalWithdrawn = $this->walletService->getTotalWithdrawn($userId);
        $transactions = $this->walletService->getUnifiedRevenueTransactions($userId, $request->only(['date_from', 'date_to']));
        $bankAccounts = $this->walletService->getBankAccounts($userId);
            
        return Inertia::render('Seller/Revenues', [
            'wallet' => [
                'id' => $wallet ? $wallet['id'] : null,
                'balance_available' => $wallet ? (float) $wallet['balance_available'] : 0,
                'balance_pending' => $wallet ? (float) $wallet['balance_pending'] : 0,
            ],
            'totalWithdrawn' => (float) $totalWithdrawn,
            'transactions' => $transactions,
            'bankAccounts' => $bankAccounts,
        ]);
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000',
            'bank_account_id' => 'required|exists:user_bank_accounts,id',
        ], [
            'amount.min' => 'Số tiền rút tối thiểu là 50,000đ',
            'bank_account_id.required' => 'Vui lòng chọn tài khoản ngân hàng',
        ]);

        try {
            $withdrawalData = WithdrawalData::fromRequest($request, Auth::id());
            $this->walletService->processWithdrawal($withdrawalData);
            
            return back()->with('success', 'Đã gửi yêu cầu rút tiền thành công. Admin sẽ duyệt trong vòng 24h.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
