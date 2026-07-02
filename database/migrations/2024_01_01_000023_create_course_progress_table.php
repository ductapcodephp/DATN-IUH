<?php
// === FILE: database/migrations/2024_01_01_000022_create_course_progress_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->integer('watched_seconds')->default(0)->comment('Seconds watched in this lesson');
            $table->integer('duration_seconds')->default(0)->comment('Total lesson duration');
            $table->boolean('is_completed')->default(false)->comment('Lesson fully watched');
            $table->timestamp('last_watched_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->unique(['user_id', 'lesson_id']);
            $table->index('user_id');
            $table->index('course_id');
            $table->index('is_completed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_progress');
    }
};
