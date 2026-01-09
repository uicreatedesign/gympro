<?php

namespace App\Notifications\Events;

class SubscriptionExpiringEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'subscription_expiring',
            'title' => 'Subscription Expiring Soon',
            'message' => "Your subscription will expire on {$this->data['end_date']}",
            'data' => ['subscription_id' => $this->data['subscription_id']],
            'priority' => 'high',
            'color' => '#f59e0b',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push', 'email'];
    }
}
