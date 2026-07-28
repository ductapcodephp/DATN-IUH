<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_block_content', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->integer('sort_order')->nullable();
            $table->longText('config')->nullable();
            $table->string('status')->nullable();
            $table->string('slug')->nullable();
            $table->longText('image_icon')->nullable();
            $table->longText('image')->nullable();
            $table->longText('image_mobile')->nullable();
            $table->longText('background')->nullable();
            $table->longText('mobile_background')->nullable();
            $table->string('type')->nullable();
            $table->longText('text_icon')->nullable();
            $table->longText('url')->nullable();
            $table->string('location')->nullable();
            $table->longText('video_url')->nullable();
            $table->string('kind')->nullable();
            $table->string('title')->nullable();
            $table->string('sub_title')->nullable();
            $table->longText('description')->nullable();
            $table->longText('content')->nullable();
            $table->longText('thumbnail')->nullable();
            $table->string('button')->nullable();
            $table->string('language')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('core_post')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_block_content');
    }
};
