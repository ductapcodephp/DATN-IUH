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
            $table->string('package_type', 20)->default('default')->after('role_type')->comment('Type of package: storage, commission, default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vip_packages', function (Blueprint $table) {
            $table->dropColumn('package_type');
        });
    }
};
