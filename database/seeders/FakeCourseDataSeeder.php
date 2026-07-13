<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Video;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;

class FakeCourseDataSeeder extends Seeder
{
    public function run()
    {
        // Lấy tất cả các khóa học VIP để add data mẫu cho tiện test
        $courses = Course::vip()->get();

        if ($courses->isEmpty()) {
            echo "No VIP course found.\n";
            return;
        }

        foreach ($courses as $course) {
            echo "Faking data for course: " . $course->title . "\n";

            // Create Chapter
            $chapter = Chapter::create([
                'course_id' => $course->id,
                'title' => 'Chương 1: Bắt đầu làm quen (Fake Data)',
                'description' => 'Mô tả chương 1',
                'sort_order' => 1,
            ]);

            // Create Video Lesson
            $lesson1 = Lesson::create([
                'chapter_id' => $chapter->id,
                'course_id' => $course->id,
                'title' => 'Bài 1: Giới thiệu tổng quan',
                'description' => 'Video giới thiệu',
                'sort_order' => 1,
                'type' => 'video',
                'is_preview' => true,
                'is_published' => true,
            ]);

            // Attach Video (Fake)
            Video::create([
                'lesson_id' => $lesson1->id,
                'r2_key' => 'fake_video.mp4',
                'url' => 'https://www.w3schools.com/html/mov_bbb.mp4', // Fallback URL
                'duration_seconds' => 120,
                'size_bytes' => 1024000,
                'mime_type' => 'video/mp4',
                'status' => 'ready',
            ]);

            // Create Quiz Lesson
            $lesson2 = Lesson::create([
                'chapter_id' => $chapter->id,
                'course_id' => $course->id,
                'title' => 'Bài 2: Trắc nghiệm kiến thức',
                'description' => 'Làm bài trắc nghiệm',
                'sort_order' => 2,
                'type' => 'quiz_only',
                'is_preview' => false,
                'is_published' => true,
            ]);

            // Attach Quiz
            $quiz = Quiz::create([
                'lesson_id' => $lesson2->id,
                'title' => 'Quiz 1: Câu hỏi khởi động',
                'description' => 'Kiểm tra kiến thức đầu vào',
                'passing_score' => 50,
                'trigger_seconds' => 0,
                'is_required' => true,
                'sort_order' => 1,
            ]);

            // Create Quiz Questions
            $question = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => 'Laravel là gì?',
                'type' => 'single_choice',
                'points' => 10,
                'sort_order' => 1,
            ]);

            // Create Answers
            QuizAnswer::create(['quiz_question_id' => $question->id, 'answer' => 'Framework PHP', 'is_correct' => true, 'sort_order' => 1]);
            QuizAnswer::create(['quiz_question_id' => $question->id, 'answer' => 'Ngôn ngữ lập trình', 'is_correct' => false, 'sort_order' => 2]);
        }
        
        echo "Fake data generated successfully!\n";
    }
}
