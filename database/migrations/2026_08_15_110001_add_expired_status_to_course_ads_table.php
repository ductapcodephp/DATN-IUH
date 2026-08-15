<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE course_ads MODIFY COLUMN status ENUM('active', 'paused', 'out_of_budget', 'expired') DEFAULT 'paused'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE course_ads MODIFY COLUMN status ENUM('active', 'paused', 'out_of_budget') DEFAULT 'paused'");
    }
};
