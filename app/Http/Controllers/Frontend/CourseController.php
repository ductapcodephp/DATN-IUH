<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Report;
use App\Models\SystemSetting;
use App\Models\User;
use App\Notifications\Admin\NewReportNotification;
use App\Notifications\Seller\NewCourseEnrollmentNotification;
use App\Services\Frontend\CourseService;
use App\Services\Shared\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;

    protected $reviewService;

    public function __construct(CourseService $courseService, ReviewService $reviewService)
    {
        $this->courseService = $courseService;
        $this->reviewService = $reviewService;
    }

    public function searchSuggestions(Request $request)
    {
        $keyword = $request->query('keyword', '');
        $courses = $this->courseService->searchSuggestions($keyword, 5);

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }



    public function show($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);
        $relatedCourses = $this->courseService->getRelatedCourses($course, 4);
        $enrollment = $this->courseService->getEnrollment(auth()->id(), $course->id);
        $isEnrolled = $enrollment ? true : false;

        $reviews = $this->reviewService->getCourseReviews($course->id);
        $userReview = $this->reviewService->getUserReviewForCourse(auth()->id(), $course->id);

        $data = compact('course', 'relatedCourses', 'isEnrolled', 'enrollment', 'reviews', 'userReview');

        return Inertia::render('Frontend/Course/Detail', $data);
    }

    public function enrollFreeCourse($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);

        if (! $course->is_free && $course->price > 0) {
            return back()->with('error', 'Khóa học này không miễn phí!');
        }

        $userId = auth()->id();
        $enrollment = $this->courseService->getEnrollment($userId, $course->id);

        if ($enrollment) {
            return redirect()->route('frontend.course.learn', $slug)->with('success', 'Bạn đã tham gia khóa học này rồi!');
        }

        $this->courseService->createFreeOrderAndEnrollment($userId, $course);

        if ($course->seller) {
            $course->seller->notify(new NewCourseEnrollmentNotification(
                $course->title,
                auth()->user()->name,
                $course->id
            ));
        }

        return back()->with('success', 'Đã mở khóa khóa học miễn phí thành công!');
    }

    public function reportCourse(Request $request, Course $course)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        $alreadyReported = Report::where('reporter_id', auth()->id())
            ->where('reportable_type', Course::class)
            ->where('reportable_id', $course->id)
            ->exists();

        if ($alreadyReported) {
            return back()->with('error', 'Bạn đã gửi báo cáo cho khóa học này rồi. Ban quản trị đang xem xét xử lý.');
        }

        $report = Report::create([
            'reporter_id' => auth()->id(),
            'reportable_type' => Course::class,
            'reportable_id' => $course->id,
            'reason' => $request->input('reason'),
            'details' => $request->input('details'),
            'status' => 'pending',
        ]);

        if (SystemSetting::where('key', 'notify_new_report')->value('value') == '1') {
            $admins = User::whereIn('current_role', [UserRole::ADMIN, UserRole::ROOT])->get();
            Notification::send($admins, new NewReportNotification($report));
        }

        return back()->with('success', 'Đã gửi báo cáo khóa học lên Ban Quản trị thành công.');
    }
}
