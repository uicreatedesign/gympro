<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class TestNotification extends Notification
{
    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Test Notification',
            'message' => 'This is a test notification from Gympro',
            'data' => ['test' => true],
        ];
    }
}
