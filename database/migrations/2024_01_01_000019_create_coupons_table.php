<?php
// === FILE: database/migrations/2024_01_01_000018_create_coupons_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->nullable()->constrained('users')->onDelete('cascade')->comment('Seller who created coupon, null = root');
            $table->string('code')->unique();
            $table->enum('type', ['percent', 'fixed'])->comment('Discount type');
            $table->decimal('value', 10, 2)->comment('Discount value (% or amount)');
            $table->decimal('min_order_amount', 10, 2)->nullable()->comment('Minimum order amount to apply');
            $table->decimal('max_discount_amount', 10, 2)->nullable()->comment('Max discount cap');
            $table->integer('max_uses')->nullable()->comment('Max total uses, null = unlimited');
            $table->integer('used_count')->default(0);
            $table->foreignId('course_id')->nullable()->constrained('courses')->onDelete('set null')->comment('Null = applies to all courses');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->index('seller_id');
            $table->index('course_id');
            $table->index('is_active');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
