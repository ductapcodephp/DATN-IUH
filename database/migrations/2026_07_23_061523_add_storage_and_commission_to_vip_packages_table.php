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
        Schema::table('vip_packages', function (Blueprint $table) {
            $table->integer('max_storage_gb')->default(5)->after('duration_days')->comment('Max storage quota in GB');
            $table->decimal('commission_rate', 5, 2)->nullable()->after('max_storage_gb')->comment('Platform fee % for this package');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vip_packages', function (Blueprint $table) {
            $table->dropColumn(['max_storage_gb', 'commission_rate']);
        });
    }
};
