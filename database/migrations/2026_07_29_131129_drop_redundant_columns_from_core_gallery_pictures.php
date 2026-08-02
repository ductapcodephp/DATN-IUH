<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('core_gallery_pictures', function (Blueprint $table) {
            $columnsToDrop = ['image', 'image_mobile', 'link', 'url_video', 'title', 'sub_title', 'name'];
            
            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('core_gallery_pictures', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('core_gallery_pictures', function (Blueprint $table) {
            if (!Schema::hasColumn('core_gallery_pictures', 'image')) $table->string('image')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'image_mobile')) $table->string('image_mobile')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'link')) $table->string('link')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'url_video')) $table->string('url_video')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'title')) $table->string('title')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'sub_title')) $table->string('sub_title')->nullable();
            if (!Schema::hasColumn('core_gallery_pictures', 'name')) $table->string('name')->nullable();
        });
    }
};
