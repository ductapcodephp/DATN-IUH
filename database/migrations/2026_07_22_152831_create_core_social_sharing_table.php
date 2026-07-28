<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_social_sharing', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->string('google_title')->nullable();
            $table->longText('google_description')->nullable();
            $table->longText('google_tag')->nullable();
            $table->string('facebook_title')->nullable();
            $table->longText('facebook_description')->nullable();
            $table->longText('facebook_thumbnail')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('core_post')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_social_sharing');
    }
};
