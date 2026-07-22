<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1. Thêm cột order_id để link earning transaction → order
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id')->nullable()
                ->after('wallet_id')
                ->comment('Linked order for seller earning transactions');

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
        });

        // 2. Đổi enum type: thêm 'earning' và 'withdrawal'
        // MySQL cần alter column để thêm enum value
        DB::statement("ALTER TABLE wallet_transactions MODIFY COLUMN type ENUM('deposit','purchase','refund','commission','vip_payment','earning','withdrawal') NOT NULL COMMENT 'Transaction type'");
    }

    public function down(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });

        DB::statement("ALTER TABLE wallet_transactions MODIFY COLUMN type ENUM('deposit','purchase','refund','commission','vip_payment') NOT NULL COMMENT 'Transaction type'");
    }
};
