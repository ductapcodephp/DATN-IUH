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
        Schema::table('vip_subscriptions', function (Blueprint $table) {
            $table->index(['user_id', 'status', 'expires_at'], 'idx_vip_subs_user_status_expires');
        });

        Schema::table('vip_packages', function (Blueprint $table) {
            $table->index('package_type', 'idx_vip_packages_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vip_subscriptions', function (Blueprint $table) {
            $table->dropIndex('idx_vip_subs_user_status_expires');
        });

        Schema::table('vip_packages', function (Blueprint $table) {
            $table->dropIndex('idx_vip_packages_type');
        });
    }
};
