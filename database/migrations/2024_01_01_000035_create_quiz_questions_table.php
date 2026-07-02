<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->text('question');
            $table->string('type')->default('single_choice')->comment('single_choice, multiple_choice'); // 🔥 MỚI: Loại câu hỏi
            $table->integer('points')->default(1)->comment('Trọng số điểm của câu hỏi này'); // 🔥 MỚI: Điểm số cho câu hỏi
            $table->text('explanation')->nullable()->comment('Giải thích sau khi chọn'); // 🔥 MỚI: Lời giải thích
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
            
            $table->index('quiz_id');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};