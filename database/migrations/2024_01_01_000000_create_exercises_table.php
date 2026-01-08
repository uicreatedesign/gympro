<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name', 255)->unique();
            $table->text('description')->nullable();
            $table->string('category', 100);
            $table->string('muscle_group', 100);
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced']);
            $table->text('instructions')->nullable();
            $table->string('image_primary', 255)->nullable();
            $table->string('image_secondary', 255)->nullable();
            $table->string('video_url', 255)->nullable();
            $table->string('equipment_required', 255)->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->integer('calories_burned')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('category');
            $table->index('muscle_group');
            $table->index('difficulty');
            $table->index('status');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
