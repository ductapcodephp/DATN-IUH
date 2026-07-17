<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade')->comment('Dành cho   
  reply');

            $table->text('content');

            $table->boolean('is_pinned')->default(false)->comment('Giảng viên ghim lên đầu');
            $table->boolean('is_hidden')->default(false)->comment('Ẩn bởi giảng viên/admin');

            $table->unsignedInteger('likes_count')->default(0);

            $table->timestamps();

            $table->index(['lesson_id', 'is_hidden', 'parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
