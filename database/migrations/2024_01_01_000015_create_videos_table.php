<?php
// === FILE: database/migrations/2024_01_01_000014_create_videos_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->unique()->constrained('lessons')->onDelete('cascade');
            $table->string('r2_key')->nullable()->comment('Cloudflare R2 file path');
            $table->string('url')->nullable()->comment('Full video URL');
            $table->integer('duration_seconds')->default(0);
            $table->bigInteger('size_bytes')->nullable();
            $table->string('mime_type')->nullable()->default('video/mp4');
            $table->enum('status', ['processing', 'ready', 'error'])->default('processing');
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->index('lesson_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
