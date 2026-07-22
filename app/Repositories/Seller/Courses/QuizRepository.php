<?php

declare(strict_types=1);

namespace App\Repositories\Seller\Courses;

use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;

class QuizRepository
{
    public function getFirstByLesson(Lesson $lesson): ?Quiz
    {
        return $lesson->quizzes()->first();
    }

    public function createQuiz(array $data): Quiz
    {
        return Quiz::query()->create($data);
    }

    public function updateQuiz(Quiz $quiz, array $data): bool
    {
        return $quiz->update($data);
    }

    public function deleteQuiz(Quiz $quiz): bool
    {
        return $quiz->delete();
    }

    public function findQuestionById(int $questionId): QuizQuestion
    {
        return QuizQuestion::with('quiz.lesson.course')->findOrFail($questionId);
    }

    public function getMaxQuestionSortOrder(Quiz $quiz): int
    {
        return (int) $quiz->questions()->max('sort_order');
    }

    public function createQuestion(Quiz $quiz, array $data): QuizQuestion
    {
        return $quiz->questions()->create($data);
    }

    public function updateQuestionSortOrder(int $questionId, int $sortOrder): int
    {
        return QuizQuestion::query()
            ->where('id', $questionId)
            ->update(['sort_order' => $sortOrder]);
    }
}
