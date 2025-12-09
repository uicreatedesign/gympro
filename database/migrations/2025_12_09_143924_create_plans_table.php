<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('duration_months');
            $table->decimal('price', 10, 2);
            $table->decimal('admission_fee', 10, 2)->default(0);
            $table->enum('shift', ['morning', 'evening', 'full_day'])->default('full_day');
            $table->string('shift_time')->nullable();
            $table->boolean('personal_training')->default(false);
            $table->boolean('group_classes')->default(true);
            $table->boolean('locker_facility')->default(false);
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
