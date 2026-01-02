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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->decimal('amount_paid', 10, 2)->default(0)->after('end_date');
            $table->decimal('admission_fee_paid', 10, 2)->default(0)->after('amount_paid');
            $table->enum('payment_status', ['pending', 'paid', 'overdue'])->default('pending')->after('admission_fee_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['amount_paid', 'admission_fee_paid', 'payment_status']);
        });
    }
};
