<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Notifications\Seller\NewCourseEnrollmentNotification;
use App\Services\Frontend\CourseService;
use App\Services\Shared\ReviewService;
use Illuminate\Http\Request;
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

        $reviews = $this->reviewService->getCourseReviews($course->id);
        $userReview = $this->reviewService->getUserReviewForCourse(auth()->id(), $course->id);

        return Inertia::render('Frontend/Course/Detail', compact('course', 'relatedCourses', 'isEnrolled', 'enrollment', 'reviews', 'userReview'));
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
}
