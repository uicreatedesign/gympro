<?php

namespace Database\Seeders;

use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSettingSeeder extends Seeder
{
    private const EVENTS = [
        'member_registered',
        'subscription_created',
        'subscription_expiring',
        'subscription_expired',
        'payment_received',
        'payment_failed',
        'attendance_marked',
    ];

    private const CHANNELS = ['email', 'push', 'sms', 'whatsapp'];

    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            foreach (self::EVENTS as $event) {
                foreach (self::CHANNELS as $channel) {
                    NotificationSetting::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'event_type' => $event,
                            'channel' => $channel,
                        ],
                        [
                            'enabled' => in_array($channel, ['email', 'push']),
                        ]
                    );
                }
            }
        }
    }
}
