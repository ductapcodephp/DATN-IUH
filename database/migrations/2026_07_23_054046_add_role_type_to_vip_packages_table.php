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
            $table->enum('role_type', ['user', 'seller'])->default('user')->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vip_packages', function (Blueprint $table) {
            $table->dropColumn('role_type');
        });
    }
};
