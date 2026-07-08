<?php

declare(strict_types=1);

namespace App\Services\Seller\Courses;

use App\DTO\Course\Lesson\ReorderQuestionData;
use App\DTO\Course\Lesson\StoreQuestionData;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Repositories\Seller\Courses\QuizRepository;
use Illuminate\Support\Facades\DB;

class QuizService
{
    public function __construct(
        protected QuizRepository $quizRepository
    ) {}

    public function storeQuestionForLesson(Lesson $lesson, StoreQuestionData $dto): void
    {
        DB::transaction(function () use ($lesson, $dto) {
            $quiz = $this->quizRepository->getFirstByLesson($lesson);

            // Nếu bài học chưa có Quiz nào, tự động khởi tạo 1 Quiz mới
            if (!$quiz) {
                $quiz = $this->quizRepository->createQuiz([
                    'lesson_id'       => $lesson->id,
                    'title'           => 'Trắc nghiệm kiến thức: ' . $lesson->title,
                    'trigger_seconds' => 0,
                    'is_required'     => false,
                ]);
            }

            $this->addSingleQuestionToQuiz($quiz, $dto);
        });
    }

    public function addSingleQuestionToQuiz(Quiz $quiz, StoreQuestionData $dto): QuizQuestion
    {
        $maxSort = $this->quizRepository->getMaxQuestionSortOrder($quiz);

        $question = $this->quizRepository->createQuestion($quiz, [
            'question'   => $dto->questionText,
            'type'       => $dto->type,
            'sort_order' => $maxSort + 1,
        ]);

        foreach ($dto->answers as $index => $answerDto) {
            $question->answers()->create([
                'answer'     => $answerDto->text,
                'is_correct' => $answerDto->isCorrect,
                'sort_order' => $index + 1,
            ]);
        }

        return $question;
    }

    public function updateSingleQuestion(QuizQuestion $question, StoreQuestionData $dto): void
    {
        DB::transaction(function () use ($question, $dto) {
            $question->update([
                'question' => $dto->questionText,
                'type'     => $dto->type,
            ]);

            // Xóa hết đáp án cũ và tạo lại
            $question->answers()->delete();

            foreach ($dto->answers as $index => $answerDto) {
                $question->answers()->create([
                    'answer'     => $answerDto->text,
                    'is_correct' => $answerDto->isCorrect,
                    'sort_order' => $index + 1,
                ]);
            }
        });
    }

    public function deleteQuestion(QuizQuestion $question): void
    {
        DB::transaction(function () use ($question) {
            $question->answers()->delete();
            $question->delete();
        });
    }

    public function reorderQuestions(ReorderQuestionData $dto): void
    {
        DB::transaction(function () use ($dto) {
            foreach ($dto->questionIds as $index => $questionId) {
                $this->quizRepository->updateQuestionSortOrder($questionId, $index + 1);
            }
        });
    }
}