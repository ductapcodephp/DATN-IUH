<?php
App\Models\Lesson::whereIn('type', ['quiz_only', 'quiz'])
    ->doesntHave('quizzes')
    ->get()
    ->each(function ($lesson) {
        App\Models\Quiz::create([
            'lesson_id'       => $lesson->id,
            'title'           => 'Bài tập: ' . $lesson->title,
            'trigger_seconds' => 0,
            'is_required'     => false,
        ]);
        echo "Created quiz for lesson " . $lesson->id . "\n";
    });
