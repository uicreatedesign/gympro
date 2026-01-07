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
        Schema::create('exercise_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->integer('sets')->default(3);
            $table->integer('reps')->nullable(); // for strength exercises
            $table->integer('duration_seconds')->nullable(); // for cardio exercises
            $table->integer('rest_seconds')->default(60);
            $table->integer('order')->default(0); // to maintain exercise sequence
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['exercise_id', 'plan_id']); // prevent duplicate assignments
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_plan');
    }
};
