<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'app_name', 'value' => 'GymPro', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'app_logo', 'value' => null, 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'currency', 'value' => 'INR', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'currency_symbol', 'value' => '₹', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'tax_rate', 'value' => '18', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'business_name', 'value' => 'GymPro Fitness Center', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'business_address', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'business_phone', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'business_email', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'business_website', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'timezone', 'value' => 'Asia/Kolkata', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'date_format', 'value' => 'd/m/Y', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
