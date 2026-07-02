<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable(); // 🔥 MỚI: Mô tả trước khi làm bài
            $table->integer('passing_score')->default(80); // 🔥 MỚI: Mức điểm đỗ (Mặc định 80/100)
            $table->integer('trigger_seconds')->default(0)->comment('Timestamp in video to trigger quiz');
            $table->boolean('is_required')->default(false)->comment('Must complete to continue');
            $table->integer('sort_order')->default(0)->comment('Sắp xếp quiz trong lesson');
            $table->softDeletes();
            $table->timestamps();
            
            $table->index('lesson_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};