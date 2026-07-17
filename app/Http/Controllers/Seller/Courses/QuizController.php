<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seller\Courses;

use App\DTO\Seller\Course\Lesson\ReorderQuestionData;
use App\DTO\Seller\Course\Lesson\StoreQuestionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Courses\Quizzes\ReorderQuizQuestionsRequest;
use App\Http\Requests\Seller\Courses\Quizzes\StoreQuizQuestionRequest;
use App\Http\Requests\Seller\Courses\Quizzes\UpdateQuizQuestionRequest;
use App\Models\Lesson;
use App\Models\QuizQuestion;
use App\Services\Seller\Courses\QuizService;
use Illuminate\Http\RedirectResponse;

class QuizController extends Controller
{
    public function __construct(
        protected QuizService $quizService
    ) {}

    public function storeQuestion(StoreQuizQuestionRequest $request, mixed $course, int $lessonId): RedirectResponse
    {
        $lesson = Lesson::findOrFail($lessonId);
        $dto = StoreQuestionData::fromRequest($request);

        $this->quizService->storeQuestionForLesson($lesson, $dto);

        return back()->with('success', 'Đã lưu câu hỏi trắc nghiệm thành công!');
    }

    public function updateQuestion(UpdateQuizQuestionRequest $request, mixed $course, int $questionId): RedirectResponse
    {
        $question = QuizQuestion::findOrFail($questionId);
        $dto = StoreQuestionData::fromRequest($request);

        $this->quizService->updateSingleQuestion($question, $dto);

        return back()->with('success', 'Đã cập nhật câu hỏi!');
    }

    public function destroyQuestion(mixed $course, int $questionId): RedirectResponse
    {
        $question = QuizQuestion::with('quiz.lesson.course')->findOrFail($questionId);
        $this->authorizeAccess($question);

        $this->quizService->deleteQuestion($question);

        return back()->with('success', 'Đã xóa câu hỏi!');
    }

    public function reorderQuizzes(ReorderQuizQuestionsRequest $request, mixed $course, Lesson $lesson): RedirectResponse
    {
        $dto = ReorderQuestionData::fromRequest($request);

        $this->quizService->reorderQuestions($dto);

        return back()->with('success', 'Đã cập nhật vị trí câu hỏi!');
    }

    /**
     * Helper kiểm tra phân quyền riêng cho hành động Destroy không có Request class
     */
    protected function authorizeAccess(QuizQuestion $question): void
    {
        $course = $question->quiz?->lesson?->course;

        if (!$course || (int) $course->seller_id !== (int) auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác trên câu hỏi này!');
        }
    }
}
