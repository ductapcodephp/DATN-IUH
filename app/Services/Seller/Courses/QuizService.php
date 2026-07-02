<?php

namespace App\Services\Seller\Courses;

use App\Models\Lesson;
use App\Models\Quiz;
use App\Repositories\Seller\Courses\QuizRepository;
use Illuminate\Support\Facades\DB;

class QuizService
{
    protected $quizRepository;

    public function __construct(QuizRepository $quizRepository)
    {
        $this->quizRepository = $quizRepository;
    }

    public function createQuizWithQuestions(Lesson $lesson, array $data)
    {
        return DB::transaction(function () use ($lesson, $data) {
            $quiz = $this->quizRepository->createQuiz([
                'lesson_id'       => $lesson->id,
                'title'           => $data['title'],
                // Bỏ description và passing_score vì DB không có
                'trigger_seconds' => $data['trigger_seconds'] ?? 0,
                'is_required'     => $data['is_required'] ?? false,
            ]);

            $this->syncQuestions($quiz, $data['questions'] ?? []);
            return $quiz;
        });
    }
public function updateSingleQuestion(\App\Models\QuizQuestion $question, array $qData): void
{
    DB::transaction(function () use ($question, $qData) {
        $question->update(['question' => $qData['question']]);

        // Xóa hết đáp án cũ rồi tạo lại theo dữ liệu mới (đơn giản và an toàn nhất)
        $question->answers()->delete();

        foreach ($qData['answers'] as $aIndex => $aData) {
            $question->answers()->create([
                'answer'     => $aData['answer'],
                'is_correct' => $aData['is_correct'],
                'sort_order' => $aIndex + 1,
            ]);
        }
    });
}
    public function updateQuizWithQuestions(Quiz $quiz, array $data)
    {
        return DB::transaction(function () use ($quiz, $data) {
            $this->quizRepository->updateQuiz($quiz, [
                'title'           => $data['title'],
                'trigger_seconds' => $data['trigger_seconds'] ?? $quiz->trigger_seconds,
                'is_required'     => $data['is_required'] ?? $quiz->is_required,
            ]);

            // Xóa sạch câu hỏi cũ để lưu lại bộ mới
            $quiz->questions()->delete();
            $this->syncQuestions($quiz, $data['questions'] ?? []);

            return $quiz;
        });
    }

    public function deleteQuiz(Quiz $quiz)
    {
        return $this->quizRepository->deleteQuiz($quiz);
    }

    public function addSingleQuestionToQuiz(Quiz $quiz, array $qData): void
    {
        $maxSort = $quiz->questions()->max('sort_order') ?? 0;

        $question = $quiz->questions()->create([
            'question'    => $qData['question'],
            // Bỏ type, points, explanation vì DB không có
            'sort_order'  => $maxSort + 1,
        ]);

        foreach ($qData['answers'] as $aIndex => $aData) {
            $question->answers()->create([
                'answer'     => $aData['answer'],
                'is_correct' => $aData['is_correct'],
                'sort_order' => $aIndex + 1,
            ]);
        }
    }

    private function syncQuestions(Quiz $quiz, array $questionsData): void
    {
        foreach ($questionsData as $qIndex => $qData) {
            $question = $quiz->questions()->create([
                'question'    => $qData['question'],
                'sort_order'  => $qIndex + 1,
            ]);

            foreach ($qData['answers'] as $aIndex => $aData) {
                $question->answers()->create([
                    'answer'     => $aData['answer'],
                    'is_correct' => $aData['is_correct'],
                    'sort_order' => $aIndex + 1,
                ]);
            }
        }
    }
}
