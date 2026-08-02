<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseAd;
use App\Models\Course;
use Illuminate\Support\Facades\DB;

class AdTrackingController extends Controller
{
    public function trackClick($id)
    {
        $ad = CourseAd::with('course')->findOrFail($id);

        if ($ad->status === 'active' && $ad->campaign_balance > 0) {
            DB::beginTransaction();
            try {
                // Determine how much to deduct
                $deductAmount = min($ad->bid_price, $ad->campaign_balance);
                
                // Deduct from campaign balance and increase spent_today
                $ad->campaign_balance -= $deductAmount;
                $ad->spent_today += $deductAmount;
                $ad->clicks += 1;

                // Check budget exhaustion
                if ($ad->campaign_balance <= 0 || $ad->spent_today >= $ad->daily_budget) {
                    $ad->status = 'out_of_budget';
                }

                $ad->save();
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                // Log error but still redirect user so UX isn't broken
                \Log::error('Ad tracking failed: ' . $e->getMessage());
            }
        }

        if ($ad->course) {
            return redirect()->route('frontend.course.detail', $ad->course->slug);
        }

        return redirect()->route('frontend.home');
    }
}
