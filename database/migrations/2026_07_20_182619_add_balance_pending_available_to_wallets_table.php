<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            // balance_available: tiền đã được giải phóng, seller có thể rút
            $table->decimal('balance_available', 15, 2)->default(0)
                ->after('balance')
                ->comment('Seller available balance (already released, can withdraw)');

            // balance_pending: tiền đang chờ giải phóng (trong 7 ngày)
            $table->decimal('balance_pending', 15, 2)->default(0)
                ->after('balance_available')
                ->comment('Seller pending balance (waiting 7 days before release)');
        });
    }

    public function down(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn(['balance_available', 'balance_pending']);
        });
    }
};
