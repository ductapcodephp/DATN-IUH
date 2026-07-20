<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Dashboard\BankAccountRequest;
use App\Services\Frontend\Dashboard\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
    ) {}

    public function index(Request $request): Response
    {
        $userId       = Auth::id();
        $walletInfo   = $this->walletService->getWalletInfo($userId);
        $filters      = $request->only(['type', 'status', 'date_from', 'date_to', 'activeTab']);
        $transactions = $this->walletService->getWalletTransactions($userId, $filters);
        $onlinePayments = $this->walletService->getOnlinePayments($userId, $filters);

        return Inertia::render('Frontend/Dashboard/Wallet', [
            'wallet'       => $walletInfo,
            'transactions' => $transactions,
            'onlinePayments' => $onlinePayments,
            'filters'      => $filters,
        ]);
    }

    public function bankAccounts(): Response
    {
        $userId       = Auth::id();
        $bankAccounts = $this->walletService->getBankAccounts($userId);

        return Inertia::render('Frontend/Dashboard/BankAccounts', [
            'bankAccounts' => $bankAccounts,
        ]);
    }

    public function addBankAccount(BankAccountRequest $request)
    {
        $validated = $request->validated();

        $this->walletService->addBankAccount(Auth::id(), $validated);

        return back()->with('success', 'Đã thêm tài khoản ngân hàng thành công!');
    }

    public function updateBankAccount(BankAccountRequest $request, int $bankAccountId)
    {
        $validated = $request->validated();

        $this->walletService->updateBankAccount(Auth::id(), $bankAccountId, $validated);

        return back()->with('success', 'Đã cập nhật tài khoản ngân hàng thành công!');
    }

    public function deleteBankAccount(int $bankAccountId)
    {
        $this->walletService->deleteBankAccount(Auth::id(), $bankAccountId);
        return back()->with('success', 'Đã xóa tài khoản ngân hàng.');
    }

    public function setDefaultBankAccount(int $bankAccountId)
    {
        $this->walletService->setDefaultBankAccount(Auth::id(), $bankAccountId);
        return back()->with('success', 'Đã đặt làm tài khoản mặc định!');
    }
}
