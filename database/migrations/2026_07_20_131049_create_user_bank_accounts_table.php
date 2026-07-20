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
        Schema::create('user_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('bank_name')->comment('Tên ngân hàng (Vietcombank, MBBank...)');
            $table->string('account_name')->comment('Tên chủ tài khoản');
            $table->string('account_number')->comment('Số tài khoản');
            $table->string('branch')->nullable()->comment('Chi nhánh');
            $table->boolean('is_default')->default(false)->comment('Tài khoản nhận tiền mặc định');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_bank_accounts');
    }
};
