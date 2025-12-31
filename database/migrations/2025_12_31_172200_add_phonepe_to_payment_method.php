<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('cash', 'card', 'upi', 'bank_transfer', 'phonepe') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('cash', 'card', 'upi', 'bank_transfer') NOT NULL");
    }
};
