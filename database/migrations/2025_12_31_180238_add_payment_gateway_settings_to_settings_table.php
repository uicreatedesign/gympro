<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insert([
            ['key' => 'phonepe_enabled', 'value' => '0', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'phonepe_merchant_id', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'phonepe_salt_key', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'phonepe_salt_index', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'phonepe_env', 'value' => 'UAT', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'phonepe_enabled',
            'phonepe_merchant_id',
            'phonepe_salt_key',
            'phonepe_salt_index',
            'phonepe_env'
        ])->delete();
    }
};
