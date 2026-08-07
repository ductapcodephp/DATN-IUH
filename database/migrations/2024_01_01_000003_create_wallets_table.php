<?php
// === FILE: database/migrations/2024_01_01_000002_create_wallets_table.php ===

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->decimal('balance', 15, 2)->default(0)->comment('Wallet balance in VND');
            $table->decimal('balance_available', 15, 2)->default(0)->comment('Seller available balance (already released, can withdraw)');
            $table->decimal('balance_pending', 15, 2)->default(0)->comment('Seller pending balance (waiting 7 days before release)');
            $table->enum('status', ['locked', 'active'])->default('locked');
            $table->timestamps();
            
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
