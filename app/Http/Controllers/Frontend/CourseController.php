<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Order;
use App\Models\CourseEnrollment;
class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category', 'price', 'rating', 'sort']);
        
        $courses = $this->courseService->getAllPublishedCourses($filters, 12);
        $categories = $this->courseService->getActiveCategories();
        $enrolledCourseIds = $this->courseService->getEnrolledCourseIds(auth()->id());

        return Inertia::render('Frontend/Course/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $filters,
            'enrolledCourseIds' => $enrolledCourseIds,
        ]);
    }

    public function show($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);
        $relatedCourses = $this->courseService->getRelatedCourses($course, 4);
        $enrollment = $this->courseService->getEnrollment(auth()->id(), $course->id);
        $isEnrolled = $enrollment ? true : false;

        $reviews = $this->courseService->getCourseReviews($course->id);
        $userReview = $this->courseService->getUserReviewForCourse(auth()->id(), $course->id);

        return Inertia::render('Frontend/Course/Detail', compact('course', 'relatedCourses', 'isEnrolled', 'enrollment', 'reviews', 'userReview'));
    }

    public function submitReview(Request $request, $slug)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
        ]);

        $course = $this->courseService->getCourseDetailBySlug($slug);
        $enrollment = $this->courseService->getEnrollment(auth()->id(), $course->id);

        if (!$enrollment) {
            return back()->with('error', 'Bạn chưa tham gia khóa học này!');
        }

        if ($enrollment->progress < 80) {
            return back()->with('error', 'Bạn cần hoàn thành ít nhất 80% khóa học để đánh giá!');
        }

        $existingReview = $this->courseService->getUserReviewForCourse(auth()->id(), $course->id);

        if ($existingReview) {
            return back()->with('error', 'Bạn đã đánh giá khóa học này rồi!');
        }

        $order = $this->courseService->getCompletedOrderForCourse(auth()->id(), $course->id);

        if (!$order) {
            return back()->with('error', 'Không tìm thấy hóa đơn của bạn cho khóa học này!');
        }

        $this->courseService->createReview([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'order_id' => $order->id,
            'rating' => $request->input('rating'),
            'content' => $request->input('content'),
            'is_hidden' => false,
        ]);

        return back()->with('success', 'Đánh giá của bạn đã được gửi thành công!');
    }

    public function enrollFreeCourse($slug)
    {
        $course = $this->courseService->getCourseDetailBySlug($slug);

        if (!$course->is_free && $course->price > 0) {
            return back()->with('error', 'Khóa học này không miễn phí!');
        }

        $userId = auth()->id();
        $enrollment = $this->courseService->getEnrollment($userId, $course->id);

        if ($enrollment) {
            return redirect()->route('frontend.course.learn', $slug)->with('success', 'Bạn đã tham gia khóa học này rồi!');
        }

        $this->courseService->createFreeOrderAndEnrollment($userId, $course);

        return back()->with('success', 'Đã mở khóa khóa học miễn phí thành công!');
    }
}
