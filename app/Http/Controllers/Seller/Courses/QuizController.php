<?php

namespace App\Http\Controllers\Seller\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\QuizQuestion;
use App\Services\Seller\Courses\QuizService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    protected $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
    }

    private function authorizeSeller(Course $course)
    {
        if ($course->seller_id !== auth()->id()) {
            abort(403, 'Bạn không có quyền truy cập khóa học này!');
        }
    }

    public function storeQuestion(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $course = $lesson->course;
        $this->authorizeSeller($course);

        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:single_choice,multiple_choice', // 🔥 Thêm validate type
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        $data = [
            'title' => 'Trắc nghiệm kiến thức: '.$lesson->title,
            'passing_score' => 80,
            'questions' => [
                [
                    'question' => $validated['question_text'],
                    'type' => $validated['type'], // 🔥 Lấy type từ Request
                    'points' => 1,
                    'answers' => array_map(function ($ans) {
                        return [
                            'answer' => $ans['text'],
                            'is_correct' => $ans['is_correct'],
                        ];
                    }, $validated['answers']),
                ],
            ],
        ];

        $quiz = $lesson->quizzes()->first();

        if ($quiz) {
            $this->quizService->addSingleQuestionToQuiz($quiz, $data['questions'][0]);
        } else {
            $this->quizService->createQuizWithQuestions($lesson, $data);
        }

        return back()->with('success', 'Đã lưu câu hỏi trắc nghiệm thành công!');
    }

    public function updateQuestion(Request $request, $course, $questionId)
    {
        $question = QuizQuestion::with('quiz.lesson.course')->findOrFail($questionId);
        $this->authorizeSeller($question->quiz->lesson->course);

        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:single_choice,multiple_choice', // 🔥 Thêm validate type
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        $this->quizService->updateSingleQuestion($question, [
            'question' => $validated['question_text'],
            'type' => $validated['type'], // 🔥 Cập nhật type mới
            'answers' => array_map(function ($ans) {
                return [
                    'answer' => $ans['text'],
                    'is_correct' => $ans['is_correct'],
                ];
            }, $validated['answers']),
        ]);

        return back()->with('success', 'Đã cập nhật câu hỏi!');
    }

    public function destroyQuestion(Request $request, $course, $questionId)
    {
        $question = QuizQuestion::with('quiz.lesson.course')->findOrFail($questionId);
        $this->authorizeSeller($question->quiz->lesson->course);

        DB::transaction(function () use ($question) {
            $question->answers()->delete();
            $question->delete();
        });

        return back()->with('success', 'Đã xóa câu hỏi!');
    }

    public function reorderQuizzes(Request $request, $course, Lesson $lesson)
    {
        $courseModel = $lesson->course;
        $this->authorizeSeller($courseModel);

        $validated = $request->validate([
            'question_ids' => 'required|array',
            'question_ids.*' => 'required|integer',
        ]);

        foreach ($validated['question_ids'] as $index => $questionId) {
            DB::table('quiz_questions')
                ->where('id', $questionId)
                ->update(['sort_order' => $index + 1]);
        }

        return back()->with('success', 'Đã cập nhật vị trí câu hỏi!');
    }
}
