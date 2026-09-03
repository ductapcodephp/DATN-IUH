<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributed_coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained('coupons')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vip_package_id')->constrained('vip_packages')->onDelete('cascade');
            $table->foreignId('vip_subscription_id')->nullable()->constrained('vip_subscriptions')->onDelete('set null');
            $table->string('code', 20)->unique();
            $table->boolean('is_used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('distributed_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('coupon_id');
            $table->index('is_used');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distributed_coupons');
    }
};
