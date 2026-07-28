<?php

namespace App\Http\Controllers\Shared;

use App\Models\Report;
use App\Models\SystemSetting;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Admin\NewReportNotification;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use App\Notifications\Seller\NewReviewNotification;
use App\Services\Frontend\CourseService;
use App\Services\Shared\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected $reviewService;

    protected $courseService;

    public function __construct(ReviewService $reviewService, CourseService $courseService)
    {
        $this->reviewService = $reviewService;
        $this->courseService = $courseService;
    }

    // ==========================================
    // FRONTEND / USER METHODS
    // ==========================================
    public function submitReview(Request $request, $slug)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
        ]);

        $course = $this->courseService->getCourseDetailBySlug($slug);
        $enrollment = $this->courseService->getEnrollment(auth()->id(), $course->id);

        if (! $enrollment) {
            return back()->with('error', 'Bạn chưa tham gia khóa học này!');
        }

        if ($enrollment->progress < 80) {
            return back()->with('error', 'Bạn cần hoàn thành ít nhất 80% khóa học để đánh giá!');
        }

        $existingReview = $this->reviewService->getUserReviewForCourse(auth()->id(), $course->id);

        if ($existingReview) {
            return back()->with('error', 'Bạn đã đánh giá khóa học này rồi!');
        }

        $order = $this->courseService->getCompletedOrderForCourse(auth()->id(), $course->id);

        if (! $order) {
            return back()->with('error', 'Không tìm thấy hóa đơn của bạn cho khóa học này!');
        }

        $this->reviewService->createReview([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'order_id' => $order->id,
            'rating' => $request->input('rating'),
            'content' => $request->input('content'),
            'is_hidden' => false,
        ]);

        if ($course->seller) {
            $course->seller->notify(new NewReviewNotification(
                $course->title,
                auth()->user()->name,
                (int) $request->input('rating'),
                $course->id
            ));
        }

        return back()->with('success', 'Đánh giá của bạn đã được gửi thành công!');
    }

    public function updateReview(Request $request, Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
        ]);

        $this->reviewService->updateReview($review->id, [
            'rating' => $request->input('rating'),
            'content' => $request->input('content'),
        ]);

        return back()->with('success', 'Đánh giá của bạn đã được cập nhật thành công!');
    }

    public function deleteReview(Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $this->reviewService->deleteReview($review->id);

        return back()->with('success', 'Đã xóa đánh giá thành công!');
    }

    // ==========================================
    // SELLER METHODS
    // ==========================================
    public function index(Request $request, Course $course)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $reviews = $this->reviewService->getPaginatedCourseReviews($course->id, 10);

        return Inertia::render('Seller/Reviews', [
            'course' => $course,
            'reviews' => $reviews,
        ]);
    }

    public function report(Request $request, Review $review)
    {
        $review->load('course');

        if ($review->course->seller_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $this->reviewService->updateReview($review->id, ['is_reported' => true]);

        $report = Report::create([
            'reporter_id' => auth()->id(),
            'reportable_type' => Review::class,
            'reportable_id' => $review->id,
            'reason' => $request->input('reason', 'Vi ph?m ti�u chu?n c?ng d?ng'),
            'status' => 'pending',
        ]);

        if (SystemSetting::where('key', 'notify_new_report')->value('value') == '1') {
            $admins = User::whereIn('current_role', [UserRole::ADMIN, UserRole::ROOT])->get();
            Notification::send($admins, new NewReportNotification($report));
        }

        return back()->with('success', 'Đã báo cáo vi phạm lên Ban Quản trị.');
    }

    public function reply(Request $request, Review $review)
    {
        $request->validate([
            'reply_content' => 'required|string|max:1000',
        ]);

        $review->load('course');

        if ($review->course->seller_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $this->reviewService->updateReview($review->id, ['reply_content' => $request->reply_content]);

        return back()->with('success', 'Đã phản hồi đánh giá.');
    }
}
