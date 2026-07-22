<?php

declare(strict_types=1);

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Dashboard\BankAccountRequest;
use App\Services\Finance\WalletService;
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
        $viewPrefix = Auth::user()->isSeller() ? 'Seller' : 'Frontend/Dashboard';
        
        return Inertia::render("$viewPrefix/Wallet/Index", [
            'wallet'       => $walletInfo,
            'transactions' => $transactions,
            'onlinePayments' => $onlinePayments,
            'filters'      => $filters,
        ]);
    }

    public function activate(Request $request)
    {
        $wallet = \App\Models\Wallet::firstOrCreate(
            ['user_id' => Auth::id()],
            ['balance' => 0, 'balance_available' => 0, 'balance_pending' => 0]
        );
        $wallet->status = 'active';
        $wallet->save();

        return back()->with('success', 'ÄÃ£ kÃ­ch hoáº¡t vÃ­ thÃ nh cÃ´ng!');
    }

    public function bankAccounts(Request $request): Response
    {
        $userId       = Auth::id();
        $bankAccounts = $this->walletService->getBankAccounts($userId);
        $walletInfo   = $this->walletService->getWalletInfo($userId);

        $viewPrefix = Auth::user()->isSeller() ? 'Seller' : 'Frontend/Dashboard';

        return Inertia::render("$viewPrefix/BankAccounts/Index", [
            'bankAccounts' => $bankAccounts,
            'wallet'       => $walletInfo,
        ]);
    }

    public function addBankAccount(BankAccountRequest $request)
    {
        $validated = $request->validated();

        $this->walletService->addBankAccount(Auth::id(), $validated);

        return back()->with('success', 'ÄÃ£ thÃªm tÃ i khoáº£n ngÃ¢n hÃ ng thÃ nh cÃ´ng!');
    }

    
    public function updateBankAccount(BankAccountRequest $request, int $bankAccountId)
    {
        $validated = $request->validated();

        $this->walletService->updateBankAccount(Auth::id(), $bankAccountId, $validated);

        return back()->with('success', 'ÄÃ£ cáº­p nháº­t tÃ i khoáº£n ngÃ¢n hÃ ng thÃ nh cÃ´ng!');
    }

 
    public function deleteBankAccount(int $bankAccountId)
    {
        $this->walletService->deleteBankAccount(Auth::id(), $bankAccountId);
        return back()->with('success', 'ÄÃ£ xÃ³a tÃ i khoáº£n ngÃ¢n hÃ ng.');
    }


    public function setDefaultBankAccount(int $bankAccountId)
    {
        $this->walletService->setDefaultBankAccount(Auth::id(), $bankAccountId);
        return back()->with('success', 'ÄÃ£ Ä‘áº·t lÃ m tÃ i khoáº£n máº·c Ä‘á»‹nh!');
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000',
        ]);
        
        $user = Auth::user();
        if (!$user->wallet) {
            return back()->withErrors(['amount' => 'Báº¡n chÆ°a cÃ³ vÃ­ Ä‘á»ƒ rÃºt tiá»n.']);
        }
        
        try {
            $user->wallet->withdrawAvailable((float)$request->input('amount'), 'RÃºt tiá»n vá» tÃ i khoáº£n ngÃ¢n hÃ ng');
            return back()->with('success', 'YÃªu cáº§u rÃºt tiá»n Ä‘Ã£ Ä‘Æ°á»£c táº¡o thÃ nh cÃ´ng vÃ  Ä‘ang chá» duyá»‡t.');
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
}
