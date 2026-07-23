<?php

namespace App\Http\Controllers\Frontend;

use App\DTO\Frontend\Course\SubmitQuizData;
use App\DTO\Frontend\Course\VideoProgressData;
use App\Http\Controllers\Controller;
use App\Services\Frontend\LearningService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    protected $learningService;

    public function __construct(LearningService $learningService)
    {
        $this->learningService = $learningService;
    }

    public function learn($slug)
    {
        $course = $this->learningService->getCourseForLearning($slug);

        $learnData = $this->learningService->getLearnPageData($course, auth()->id());

        if (! $learnData['isEnrolled']) {
            return redirect()->route('frontend.course.detail', $slug)->with('error', 'Bạn chưa đăng ký khóa học này.');
        }

        return Inertia::render('Frontend/Course/Learn', array_merge([
            'course' => $course,
        ], $learnData));
    }

    public function submitQuiz(Request $request, $slug, $quizId)
    {
        $request->validate([
            'answers' => 'required|array',
        ]);

        $dto = SubmitQuizData::fromRequest($request);
        $result = $this->learningService->submitQuiz($dto, $quizId, auth()->id());

        return response()->json([
            'success' => true,
            'result' => $result,
        ]);
    }

    public function updateVideoProgress(Request $request, $slug, $lessonId)
    {
        $request->validate([
            'watched_seconds' => 'required|numeric',
            'duration_seconds' => 'required|numeric',
        ]);

        $course = $this->learningService->getCourseForLearning($slug);
        $dto = VideoProgressData::fromRequest($request);

        $newWatched = $this->learningService->updateVideoProgress($dto, $course, $lessonId, auth()->id());

        return response()->json([
            'success' => true,
            'queued' => true,
            'watched_seconds' => $newWatched,
        ]);
    }
}
