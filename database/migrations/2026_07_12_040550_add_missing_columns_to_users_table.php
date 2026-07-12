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
        Schema::table('users', function (Blueprint $table) {
            // SOCIAL LOGIN (GOOGLE)
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'google_token')) {
                $table->text('google_token')->nullable()->after('google_id');
            }
            if (!Schema::hasColumn('users', 'google_refresh_token')) {
                $table->text('google_refresh_token')->nullable()->after('google_token');
            }

            // PROFILE
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('google_refresh_token');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('avatar');
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->string('bio')->nullable()->after('phone');
            }

            // ROLE SYSTEM
            if (!Schema::hasColumn('users', 'roles')) {
                $table->json('roles')->default('["user"]')->after('bio');
            }
            if (!Schema::hasColumn('users', 'current_role')) {
                $table->string('current_role')->default('user')->after('roles');
            }

            // REFERRAL SYSTEM
            if (!Schema::hasColumn('users', 'referral_code')) {
                $table->string('referral_code')->nullable()->after('current_role');
            }
            if (!Schema::hasColumn('users', 'referred_by')) {
                $table->foreignId('referred_by')->nullable()->after('referral_code');
            }

            // STATUS
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('referred_by');
            }

            // SECURITY / TRACKING
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('users', 'last_login_ip')) {
                $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            }
            if (!Schema::hasColumn('users', 'last_login_country')) {
                $table->string('last_login_country', 100)->nullable()->after('last_login_ip');
            }

            // SOFT DELETES
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'google_id', 'google_token', 'google_refresh_token',
                'avatar', 'phone', 'bio', 'roles', 'current_role',
                'referral_code', 'referred_by', 'is_active',
                'last_login_at', 'last_login_ip', 'last_login_country',
                'deleted_at',
            ];
            foreach ($columns as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
