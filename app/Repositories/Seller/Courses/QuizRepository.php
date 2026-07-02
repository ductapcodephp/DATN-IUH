<?php

namespace App\Repositories\Seller\Courses;

use App\Models\Lesson;
use App\Models\Quiz;

class QuizRepository
{
    public function getQuizByLesson(Lesson $lesson)
    {
        return $lesson->quizzes()->with(['questions.answers'])->get();
    }

    public function createQuiz(array $data)
    {
        return Quiz::create($data);
    }

    public function updateQuiz(Quiz $quiz, array $data)
    {
        $quiz->update($data);
        return $quiz;
    }

    public function deleteQuiz(Quiz $quiz)
    {
        return $quiz->delete();
    }
}
