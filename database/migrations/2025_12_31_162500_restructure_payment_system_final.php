<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add payment_source column
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('payment_source', ['manual', 'gateway'])->default('manual')->after('payment_method');
        });

        // Update payment_type enum values
        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_type ENUM('plan', 'admission', 'renewal') DEFAULT 'plan'");

        // Drop foreign key for member_id
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['member_id']);
            $table->dropColumn('member_id');
        });

        // Make subscription_id required
        DB::statement("UPDATE payments SET subscription_id = 1 WHERE subscription_id IS NULL");
        
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['subscription_id']);
        });
        
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('subscription_id')->change()->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('member_id')->after('id')->constrained()->onDelete('cascade');
            $table->dropColumn('payment_source');
        });

        DB::statement("ALTER TABLE payments MODIFY COLUMN payment_type ENUM('subscription', 'admission', 'other') DEFAULT 'subscription'");
    }
};
