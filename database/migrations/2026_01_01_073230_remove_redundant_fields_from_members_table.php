<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['name', 'email', 'phone']);
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('name')->after('user_id');
            $table->string('email')->unique()->after('name');
            $table->string('phone')->after('email');
        });
    }
};
