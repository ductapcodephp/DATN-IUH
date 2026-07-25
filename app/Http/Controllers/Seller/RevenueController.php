<?php

namespace App\Http\Controllers\Seller;

use App\Models\WithdrawalRequest;
use App\Models\SystemSetting;
use App\Models\User;
use App\Enums\UserRole;
use App\Notifications\Admin\NewWithdrawalRequestNotification;
use App\DTO\Finance\WithdrawalData;
use App\Http\Controllers\Controller;
use App\Services\Finance\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

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
            'amount.min' => 'S? ti?n rút t?i thi?u là 50,000d',
            'bank_account_id.required' => 'Vui lòng ch?n tài kho?n ngân hàng',
        ]);

        try {
            $withdrawalData = WithdrawalData::fromRequest($request, Auth::id());
            $this->walletService->processWithdrawal($withdrawalData);

            $withdrawal = WithdrawalRequest::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->first();

            if ($withdrawal) {
                $notifyWithdraw = SystemSetting::where('key', 'notify_new_withdrawal')->value('value');
                if ($notifyWithdraw == '1') {
                    $admins = User::whereIn('current_role', [UserRole::ADMIN, UserRole::ROOT])->get();
                    Notification::send($admins, new NewWithdrawalRequestNotification($withdrawal));
                }
            }

            return back()->with('success', 'Ğã g?i yêu c?u rút ti?n thành công. Admin s? duy?t trong vòng 24h.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}