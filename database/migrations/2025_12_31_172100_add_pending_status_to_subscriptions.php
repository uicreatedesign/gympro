<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE subscriptions MODIFY COLUMN status ENUM('pending', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE subscriptions MODIFY COLUMN status ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active'");
    }
};
