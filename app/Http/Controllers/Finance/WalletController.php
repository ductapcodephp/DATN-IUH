<?php

declare(strict_types=1);

namespace App\Http\Controllers\Finance;

use App\DTO\Finance\WithdrawalData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Dashboard\BankAccountRequest;
use App\Models\Wallet;
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
        $userId = Auth::id();
        $walletInfo = $this->walletService->getWalletInfo($userId);
        $filters = $request->only(['type', 'status', 'date_from', 'date_to', 'activeTab']);
        $transactions = $this->walletService->getWalletTransactions($userId, $filters);
        
        $onlinePayments = \App\Models\OnlinePayment::where('user_id', $userId)
            ->where('payment_gateway', '!=', 'wallet')
            ->orderBy('id', 'desc')
            ->paginate(15, ['*'], 'payments_page');

        // Chuyển các giao dịch nạp tiền/VIP đang pending thành failed để hiển thị cho user (do user thường bấm back trình duyệt)
        $onlinePayments->getCollection()->transform(function ($payment) {
            if ($payment->status === 'pending' && (str_starts_with($payment->transaction_code, 'DEP_') || str_starts_with($payment->transaction_code, 'VIP_'))) {
                $payment->status = 'failed';
            }
            return $payment;
        });

        $viewPrefix = Auth::user()->isSeller() ? 'Seller' : 'Frontend/Dashboard';

        return Inertia::render("$viewPrefix/Wallet/Index", [
            'wallet' => $walletInfo,
            'transactions' => $transactions,
            'onlinePayments' => $onlinePayments,
            'filters' => $filters,
        ]);
    }

    public function activate(Request $request)
    {
        $wallet = Wallet::firstOrCreate(
            ['user_id' => Auth::id()],
            ['balance' => 0, 'balance_available' => 0, 'balance_pending' => 0]
        );
        $wallet->status = 'active';
        $wallet->save();

        return back()->with('success', 'Đã kích hoạt ví thành công!');
    }

    public function bankAccounts(Request $request): Response
    {
        $userId = Auth::id();
        $bankAccounts = $this->walletService->getBankAccounts($userId);
        $walletInfo = $this->walletService->getWalletInfo($userId);

        $viewPrefix = Auth::user()->isSeller() ? 'Seller' : 'Frontend/Dashboard';

        return Inertia::render("$viewPrefix/BankAccounts/Index", [
            'bankAccounts' => $bankAccounts,
            'wallet' => $walletInfo,
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

        return back()->with('success', 'Cập nhật tài khoản ngân hàng thành công!');
    }

    public function deleteBankAccount(int $bankAccountId)
    {
        $this->walletService->deleteBankAccount(Auth::id(), $bankAccountId);

        return back()->with('success', 'Đã xóa tài khoản ngân hàng.');
    }

    public function setDefaultBankAccount(int $bankAccountId)
    {
        $this->walletService->setDefaultBankAccount(Auth::id(), $bankAccountId);

        return back()->with('success', 'Đã đặt tài khoản ngân hàng này làm mặc định!');
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000',
        ]);

        $user = Auth::user();
        if (! $user->wallet) {
            return back()->withErrors(['amount' => 'Bạn chưa có ví để rút tiền.']);
        }

        $bankAccounts = $this->walletService->getBankAccounts($user->id);
        $defaultBank = $bankAccounts->where('is_default', 1)->first() ?? $bankAccounts->first();

        if (! $defaultBank) {
            return back()->withErrors(['amount' => 'Vui lòng thêm tài khoản ngân hàng trước khi rút tiền.']);
        }

        try {
            $withdrawalData = new WithdrawalData(
                $user->id,
                (float) $request->input('amount'),
                $defaultBank->id
            );
            $this->walletService->processWithdrawal($withdrawalData);

            return back()->with('success', 'Yêu cầu rút tiền đã được tạo thành công và đang chờ duyệt.');
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }
}
