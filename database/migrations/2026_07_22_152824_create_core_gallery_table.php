<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_gallery', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('type')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('sort')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('core_gallery')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_gallery');
    }
};
