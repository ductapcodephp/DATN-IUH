<?php
// === FILE: database/migrations/2024_01_01_000024_create_video_notes_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('video_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->integer('timestamp_seconds')->comment('Timestamp in the video where note was taken');
            $table->text('content')->comment('Note content');
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('lesson_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_notes');
    }
};
