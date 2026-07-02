<?php
// === FILE: database/migrations/2024_01_01_000012_create_lessons_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained('chapters')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->enum('type', ['video', 'document', 'quiz_only'])->default('video');
            $table->boolean('is_preview')->default(false)->comment('Free preview, no purchase needed');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('chapter_id');
            $table->index('course_id');
            $table->index('type');
            $table->index('is_preview');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
