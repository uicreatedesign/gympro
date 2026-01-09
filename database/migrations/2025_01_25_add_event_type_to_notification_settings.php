<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('notification_settings')) {
            Schema::table('notification_settings', function (Blueprint $table) {
                if (!Schema::hasColumn('notification_settings', 'user_id')) {
                    $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->after('id');
                }
                if (!Schema::hasColumn('notification_settings', 'event_type')) {
                    $table->string('event_type')->default('all')->after('user_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('notification_settings')) {
            Schema::table('notification_settings', function (Blueprint $table) {
                if (Schema::hasColumn('notification_settings', 'user_id')) {
                    $table->dropForeign(['user_id']);
                    $table->dropColumn('user_id');
                }
                if (Schema::hasColumn('notification_settings', 'event_type')) {
                    $table->dropColumn('event_type');
                }
            });
        }
    }
};
