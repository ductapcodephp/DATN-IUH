<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_page', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name')->nullable();
            $table->string('type')->nullable();
            $table->string('seo_url')->nullable();
            $table->string('css')->nullable();
            $table->longText('custom_css')->nullable();
            $table->string('language')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('core_post')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('core_page')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_page');
    }
};
