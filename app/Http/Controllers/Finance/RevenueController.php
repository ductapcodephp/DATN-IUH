<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class RevenueController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $wallet = Wallet::where('user_id', $userId)->first();
        
        $totalWithdrawn = WalletTransaction::where('user_id', $userId)
            ->where('type', WalletTransaction::TYPE_WITHDRAWAL)
            ->where('status', WalletTransaction::STATUS_COMPLETED)
            ->sum('amount');
            
        $transactions = WalletTransaction::where('user_id', $userId)
            ->whereIn('type', [WalletTransaction::TYPE_WITHDRAWAL, WalletTransaction::TYPE_EARNING])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        $bankAccounts = \App\Models\UserBankAccount::where('user_id', $userId)
            ->orderBy('is_default', 'desc')
            ->get();
            
        return Inertia::render('Seller/Revenues', [
            'wallet' => [
                'id' => $wallet ? $wallet->id : null,
                'balance_available' => $wallet ? (float) $wallet->balance_available : 0,
                'balance_pending' => $wallet ? (float) $wallet->balance_pending : 0,
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

        $userId = Auth::id();
        $wallet = Wallet::where('user_id', $userId)->first();
        
        if (!$wallet || $wallet->balance_available < $request->amount) {
            return back()->with('error', 'Số dư khả dụng không đủ để rút tiền.');
        }

        // Lấy thông tin tài khoản ngân hàng để lưu vào metadata (phòng khi user xóa bank account sau này)
        $bankAccount = \App\Models\UserBankAccount::where('id', $request->bank_account_id)
            ->where('user_id', $userId)
            ->first();
            
        if (!$bankAccount) {
            return back()->with('error', 'Tài khoản ngân hàng không hợp lệ.');
        }

        $balanceBefore = $wallet->balance_available;
        
        // Trừ tiền khỏi ví available
        $wallet->balance_available -= $request->amount;
        $wallet->balance -= $request->amount;
        $wallet->save();

        // Tạo giao dịch withdrawal
        WalletTransaction::create([
            'user_id' => $userId,
            'wallet_id' => $wallet->id,
            'type' => WalletTransaction::TYPE_WITHDRAWAL,
            'amount' => $request->amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $wallet->balance_available,
            'status' => WalletTransaction::STATUS_PENDING,
            'description' => 'Yêu cầu rút tiền về ' . $bankAccount->bank_name . ' (' . $bankAccount->account_number . ')',
            'metadata' => [
                'bank_name' => $bankAccount->bank_name,
                'account_name' => $bankAccount->account_name,
                'account_number' => $bankAccount->account_number,
                'branch' => $bankAccount->branch,
            ]
        ]);

        return back()->with('success', 'Đã gửi yêu cầu rút tiền thành công. Admin sẽ duyệt trong vòng 24h.');
    }
}
