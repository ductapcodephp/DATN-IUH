<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_setting', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key')->nullable();
            $table->longText('setting_value')->nullable();
            $table->longText('setting_type')->nullable();
            $table->softDeletes();
            $table->longText('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_setting');
    }
};
