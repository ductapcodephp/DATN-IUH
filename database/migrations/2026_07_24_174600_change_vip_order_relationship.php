<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('vip_subscription_id')->nullable()->after('vip_package_id')->constrained('vip_subscriptions')->onDelete('set null');
        });

        Schema::table('vip_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('vip_subscriptions', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['vip_subscription_id']);
            $table->dropColumn('vip_subscription_id');
        });
    }
};
