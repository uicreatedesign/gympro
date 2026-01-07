<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workouts', function (Blueprint $table) {
            $table->integer('calories_burned')->nullable()->after('duration_minutes');
            $table->integer('difficulty_level')->nullable()->after('calories_burned');
            $table->text('feedback')->nullable()->after('notes');
            $table->integer('rating')->nullable()->after('feedback');
        });
    }

    public function down(): void
    {
        Schema::table('workouts', function (Blueprint $table) {
            $table->dropColumn(['calories_burned', 'difficulty_level', 'feedback', 'rating']);
        });
    }
};
