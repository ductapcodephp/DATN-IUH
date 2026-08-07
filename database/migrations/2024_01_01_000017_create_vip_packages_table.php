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
            $table->string('badge_text', 50)->nullable()->comment('Custom text for VIP badge (e.g., Uy tín, Đề xuất)');
            $table->integer('priority_level')->default(0)->comment('Priority level for sorting. Higher is better');
            $table->enum('role_type', ['user', 'seller'])->default('user');
            $table->string('package_type', 20)->default('default')->comment('Type of package: storage, commission, default');
            $table->decimal('price', 10, 2);
            $table->integer('duration_days')->comment('Number of days VIP access');
            $table->integer('max_storage_gb')->default(5)->comment('Max storage quota in GB')->nullable();
            $table->decimal('commission_rate', 5, 2)->nullable()->comment('Platform fee % for this package');
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
