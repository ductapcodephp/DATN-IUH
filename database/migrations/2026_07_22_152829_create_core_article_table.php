<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_article', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->string('language')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('post_id')->references('id')->on('core_post')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_article');
    }
};
