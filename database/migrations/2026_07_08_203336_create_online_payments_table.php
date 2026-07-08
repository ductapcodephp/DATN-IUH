<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('online_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('set null');
            $table->string('payment_gateway')->comment('vnpay, momo, stripe, paypal, etc.');
            $table->string('transaction_code')->unique()->comment('Unique transaction reference sent to gateway');
            $table->string('gateway_transaction_id')->nullable()->comment('Transaction ID returned by payment gateway');
            $table->decimal('amount', 15, 2)->comment('Transaction amount in VND');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->json('raw_response')->nullable()->comment('Full payload from IPN / webhook callback');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('order_id');
            $table->index('payment_gateway');
            $table->index('transaction_code');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('online_payments');
    }
};
