<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            
            // Khóa học & Người dạy (Seller)
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Thêm vào để Seller query siêu nhanh
            
            // Người học (Student)
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            
            // Tiến trình học tập (Từ course_user gộp sang)
            $table->integer('progress')->default(0);
            
            // Tích hợp tính năng Cấm/Chặn (Từ seller_student_blocks gộp sang)
            $table->boolean('is_banned')->default(false)->index();
            $table->string('ban_reason')->nullable();
            $table->timestamp('banned_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes(); // Xóa mềm

            // 1 học viên chỉ có 1 bản ghi enrollment trên 1 khóa học
            $table->unique(['student_id', 'course_id']);
            
            // Index phục vụ Seller quét toàn bộ học viên của mình cực nhanh
            $table->index(['seller_id', 'is_banned']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};