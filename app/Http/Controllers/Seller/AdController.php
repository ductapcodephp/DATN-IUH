<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CourseAd;
use App\Models\Course;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;

class AdController extends Controller
{
    public function index()
    {
        $sellerId = auth()->id();
        
        // Lấy tất cả khóa học của seller cùng với trạng thái quảng cáo
        $courses = Course::where('seller_id', $sellerId)
            ->where('status', 'published') // Chỉ cho phép chạy ads khóa học đã xuất bản
            ->with(['activeAd', 'ads' => function($q) {
                $q->orderBy('id', 'desc')->take(1);
            }])
            ->get();

        $wallet = Wallet::where('user_id', $sellerId)->first();
        
        return Inertia::render('Seller/Ads/Index', [
            'courses' => $courses,
            'wallet' => $wallet
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'bid_price' => 'required|numeric|min:1000', // Giá tối thiểu cho 1 click
            'daily_budget' => 'required|numeric|min:10000', // Ngân sách ngày tối thiểu
        ]);

        $course = Course::findOrFail($request->course_id);
        if ($course->seller_id !== auth()->id()) {
            abort(403);
        }

        // Lấy quảng cáo hiện tại nếu có
        $ad = CourseAd::where('course_id', $course->id)->first();
        if (!$ad) {
            $ad = new CourseAd();
            $ad->course_id = $course->id;
            $ad->user_id = auth()->id();
        }

        $ad->bid_price = $request->bid_price;
        $ad->daily_budget = $request->daily_budget;
        
        // Nếu vừa nạp tiền và budget ổn định, tự động bật
        if ($ad->campaign_balance > 0 && $ad->status == 'paused') {
            $ad->status = 'active';
        }
        
        $ad->save();

        return redirect()->back()->with('success', 'Cập nhật cấu hình quảng cáo thành công.');
    }

    public function topUp(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'amount' => 'required|numeric|min:10000', // Nạp tối thiểu 10k
        ]);

        $amount = $request->amount;
        $sellerId = auth()->id();

        DB::beginTransaction();
        try {
            $wallet = Wallet::where('user_id', $sellerId)->lockForUpdate()->first();
            
            if (!$wallet || $wallet->balance_available < $amount) {
                return redirect()->back()->with('error', 'Số dư khả dụng trong ví không đủ. Vui lòng nạp thêm tiền vào ví điện tử.');
            }

            // Lấy balance before
            $balanceBefore = $wallet->balance;

            // Trừ ví
            $wallet->balance -= $amount;
            $wallet->balance_available -= $amount;
            $wallet->save();

            // Ghi log giao dịch ví
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'user_id' => $sellerId,
                'type' => \App\Models\WalletTransaction::TYPE_PURCHASE,
                'amount' => -$amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $wallet->balance,
                'status' => 'completed',
                'description' => 'Nạp tiền vào chiến dịch quảng cáo khóa học',
                'reference_code' => 'COURSE_AD_' . $request->course_id . '_' . time()
            ]);

            // Cộng tiền vào chiến dịch quảng cáo
            $ad = CourseAd::firstOrCreate(
                ['course_id' => $request->course_id, 'user_id' => $sellerId],
                ['bid_price' => 1000, 'daily_budget' => 50000, 'status' => 'paused']
            );

            $ad->campaign_balance += $amount;
            
            // Nếu có tiền và cấu hình đã set thì bật lại quảng cáo (nếu đang out_of_budget)
            if ($ad->status == 'out_of_budget') {
                $ad->status = 'active';
            }
            $ad->save();

            DB::commit();
            return redirect()->back()->with('success', 'Nạp tiền vào quảng cáo thành công.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Đã xảy ra lỗi: ' . $e->getMessage());
        }
    }

    public function toggleStatus(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'status' => 'required|in:active,paused',
        ]);

        $ad = CourseAd::where('course_id', $request->course_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($request->status == 'active' && $ad->campaign_balance <= 0) {
            return redirect()->back()->with('error', 'Không thể bật quảng cáo khi số dư bằng 0. Vui lòng nạp thêm.');
        }

        $ad->status = $request->status;
        $ad->save();

        return redirect()->back()->with('success', 'Trạng thái quảng cáo đã được cập nhật.');
    }
}
