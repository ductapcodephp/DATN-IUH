<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_menu', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('name')->nullable();
            $table->string('position')->nullable();
            $table->string('icon')->nullable();
            $table->string('url')->nullable();
            $table->string('display')->nullable();
            $table->string('is_root')->nullable();
            $table->integer('sort_order')->nullable();
            $table->string('language')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('core_menu')->onDelete('set null');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_menu');
    }
};
