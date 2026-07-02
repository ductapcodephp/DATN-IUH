<?php
// === FILE: database/migrations/2024_01_01_000016_create_vip_packages_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vip_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('VIP package name');
            $table->decimal('price', 10, 2);
            $table->integer('duration_days')->comment('Number of days VIP access');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vip_packages');
    }
};
