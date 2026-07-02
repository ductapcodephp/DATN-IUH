<?php
// === FILE: database/migrations/2024_01_01_000028_create_reviews_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->tinyInteger('rating')->comment('Rating 1-5');
            $table->text('content')->nullable();
            $table->boolean('is_hidden')->default(false);
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->unique(['user_id', 'course_id'])->comment('One review per user per course');
            $table->index('course_id');
            $table->index('rating');
            $table->index('is_hidden');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
