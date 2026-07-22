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
        Schema::table('wallet_bonuses', function (Blueprint $table) {
            $table->decimal('max_bonus_amount', 15, 2)->nullable()->after('bonus_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallet_bonuses', function (Blueprint $table) {
            $table->dropColumn('max_bonus_amount');
        });
    }
};
