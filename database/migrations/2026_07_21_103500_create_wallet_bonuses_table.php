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
        Schema::create('wallet_bonuses', function (Blueprint $table) {
            $table->id();
            $table->decimal('min_amount', 15, 2)->comment('Số tiền nạp tối thiểu để đạt mức thưởng này');
            $table->decimal('bonus_percentage', 5, 2)->comment('Phần trăm thưởng (vd: 3.00)');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_bonuses');
    }
};
