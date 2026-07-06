<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('restrict')->comment('Course creator');
            $table->string('title');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('slug')->unique();
            $table->longText('description')->comment('Course full description');
            $table->string('thumbnail')->nullable();
            $table->decimal('price', 15, 2)->default(0.00);
            $table->decimal('original_price', 15, 2)->nullable()->comment('Price before discount');
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->enum('status', ['draft', 'published', 'hidden'])->default('draft');
            $table->boolean('is_free')->default(false);
            $table->integer('total_lessons')->default(0);
            $table->integer('total_duration_seconds')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0.00);
            $table->boolean('is_vip')->default(false)->comment('Only VIP members can view');
            $table->timestamp('vip_expires_at')->nullable()->comment('VIP access expiration');
            $table->json('requirements')->nullable()->comment('Prerequisites array');
            $table->json('outcomes')->nullable()->comment('Learning outcomes array');
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('seller_id');
            $table->index('status');
            $table->index('is_free');
            $table->index('is_vip');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};