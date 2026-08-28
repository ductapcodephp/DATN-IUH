<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->boolean('is_vip_coupon')->default(false)->after('is_active');
            $table->foreignId('vip_subscription_id')->nullable()->after('is_vip_coupon')
                ->constrained('vip_subscriptions')->onDelete('set null');
            $table->foreignId('user_id_owner')->nullable()->after('vip_subscription_id')
                ->constrained('users')->onDelete('cascade');

            $table->index('is_vip_coupon');
            $table->index('user_id_owner');
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropForeign(['vip_subscription_id']);
            $table->dropForeign(['user_id_owner']);
            $table->dropIndex(['is_vip_coupon']);
            $table->dropIndex(['user_id_owner']);
            $table->dropColumn(['is_vip_coupon', 'vip_subscription_id', 'user_id_owner']);
        });
    }
};
