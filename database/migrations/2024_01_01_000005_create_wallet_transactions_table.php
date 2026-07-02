<?php
// === FILE: database/migrations/2024_01_01_000004_create_wallet_transactions_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['deposit', 'purchase', 'refund', 'commission', 'vip_payment'])->comment('Transaction type');
            $table->decimal('amount', 15, 2)->comment('Transaction amount in VND');
            $table->decimal('balance_before', 15, 2)->comment('Balance before transaction');
            $table->decimal('balance_after', 15, 2)->comment('Balance after transaction');
            $table->text('description')->nullable();
            $table->string('reference_code')->unique()->nullable()->comment('Reference code (VNPay, order ID, etc)');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->json('metadata')->nullable()->comment('Additional data like VNPay response');
            $table->timestamps();
            
            // Indexes
            $table->index('wallet_id');
            $table->index('user_id');
            $table->index('type');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
