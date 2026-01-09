<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->change();
            $table->date('join_date')->nullable()->change();
            $table->string('gender')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->date('date_of_birth')->change();
            $table->date('join_date')->change();
            $table->string('gender')->change();
        });
    }
};
