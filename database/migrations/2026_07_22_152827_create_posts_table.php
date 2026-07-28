<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_post', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('gallery_id')->nullable();
            $table->string('url')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->integer('sort_order')->nullable();
            $table->integer('is_hot')->default(0);
            $table->integer('is_new')->default(0);
            $table->string('post_type')->nullable();
            $table->string('published')->nullable();
            $table->longText('tags')->nullable();
            $table->longText('config')->nullable();
            $table->string('title')->nullable();
            $table->string('sub_title')->nullable();
            $table->longText('thumbnail')->nullable();
            $table->longText('description')->nullable();
            $table->longText('content')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('gallery_id')->references('id')->on('core_gallery')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_post');
    }
};
