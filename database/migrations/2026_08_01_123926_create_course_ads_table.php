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
        Schema::create('course_ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->decimal('bid_price', 15, 2)->default(0); // Price per click
            $table->decimal('daily_budget', 15, 2)->default(0); // Max daily spending
            $table->decimal('campaign_balance', 15, 2)->default(0); // Available balance in the ad
            $table->decimal('spent_today', 15, 2)->default(0); // Track daily spending limit
            
            $table->integer('clicks')->default(0);
            $table->integer('impressions')->default(0);
            
            $table->enum('status', ['active', 'paused', 'out_of_budget'])->default('paused');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_ads');
    }
};
