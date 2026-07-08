<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop foreign key to modify the column
            $table->dropForeign(['course_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            // Make course_id nullable and restore foreign key
            $table->foreignId('course_id')->nullable()->change()->constrained('courses')->onDelete('restrict');
            
            // Add vip_package_id
            $table->foreignId('vip_package_id')
                ->nullable()
                ->after('course_id')
                ->constrained('vip_packages')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['vip_package_id']);
            $table->dropColumn('vip_package_id');
            
            $table->dropForeign(['course_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            // Revert course_id back to not nullable
            $table->foreignId('course_id')->nullable(false)->change()->constrained('courses')->onDelete('restrict');
        });
    }
};
