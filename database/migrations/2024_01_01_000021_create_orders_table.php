<?php
// === FILE: database/migrations/2024_01_01_000020_create_orders_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('Student who purchased');
            $table->foreignId('course_id')->constrained('courses')->onDelete('restrict');
            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->onDelete('set null');
            $table->decimal('amount_original', 10, 2)->comment('Original course price');
            $table->decimal('discount_amount', 10, 2)->default(0)->comment('Total discount from coupon');
            $table->decimal('amount_paid', 10, 2)->comment('Final amount paid');
            $table->decimal('commission_rate', 5, 2)->comment('Commission % at purchase time');
            $table->decimal('commission_amount', 10, 2)->default(0)->comment('Commission for platform');
            $table->decimal('seller_amount', 10, 2)->default(0)->comment('Amount paid to seller');
            $table->enum('status', ['pending', 'completed', 'refunded'])->default('pending');
            $table->string('payment_method')->default('wallet')->comment('wallet, vnpay, etc');
            $table->timestamp('refunded_at')->nullable();
            $table->text('refund_reason')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('course_id');
            $table->index('coupon_id');
            $table->index('status');
            $table->index('payment_method');
            $table->unique(['user_id', 'course_id'])->comment('One purchase per course per user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
