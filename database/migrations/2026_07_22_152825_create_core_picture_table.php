<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_picture', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('gallery_id')->nullable();
            $table->longText('image')->nullable();
            $table->longText('image_mobile')->nullable();
            $table->longText('link')->nullable();
            $table->integer('sort_order')->nullable();
            $table->string('url_video')->nullable();
            $table->longText('description')->nullable();
            $table->longText('name')->nullable();
            $table->string('file_name')->nullable();
            $table->string('original_name')->nullable();
            $table->string('file_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('gallery_id')->references('id')->on('core_gallery')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_picture');
    }
};
