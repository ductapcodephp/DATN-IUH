<?php

use App\Enums\UserRole;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. TẠO BẢNG USERS
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();

            $table->string('google_id')->nullable()->unique()->index();
            $table->text('google_token')->nullable();
            $table->text('google_refresh_token')->nullable();

            $table->string('avatar')->nullable();
            $table->string('phone')->nullable();
            $table->string('bio')->nullable();

         
            $table->json('roles'); 

            $table->string('current_role')
                ->default(UserRole::USER->value)
                ->index();

            $table->string('referral_code')->unique()->nullable();
            $table->foreignId('referred_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->boolean('is_active')->default(true);

            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->string('last_login_country', 100)->nullable();

            $table->integer('total_students')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // INDEXES
            $table->index('is_active');
            $table->index('email');
        });

        // 2. TẠO BẢNG PASSWORD_RESET_TOKENS
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 3. TẠO BẢNG SESSIONS
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};