<?php
// === FILE: database/migrations/2024_01_01_000026_create_comments_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade')->comment('For reply comments');
            $table->text('content');
            $table->boolean('is_hidden')->default(false)->comment('Hidden by instructor');
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('lesson_id');
            $table->index('parent_id');
            $table->index('is_hidden');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
