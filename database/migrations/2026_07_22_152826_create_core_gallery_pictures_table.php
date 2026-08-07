<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_gallery_pictures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('gallery_id')->nullable();
            $table->unsignedBigInteger('picture_id')->nullable();
            $table->integer('sort_order')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('gallery_id')->references('id')->on('core_gallery')->onDelete('cascade');
            $table->foreign('picture_id')->references('id')->on('core_picture')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_gallery_pictures');
    }
};
