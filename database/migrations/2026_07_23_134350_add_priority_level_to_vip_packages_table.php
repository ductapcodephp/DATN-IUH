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
            $table->integer('priority_level')->default(0)->comment('Priority level for sorting. Higher is better')->after('badge_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vip_packages', function (Blueprint $table) {
            //
        });
    }
};
