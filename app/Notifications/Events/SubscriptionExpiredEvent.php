<?php

namespace App\Notifications\Events;

class SubscriptionExpiredEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'subscription_expired',
            'title' => 'Subscription Expired',
            'message' => "Your {$this->data['plan_name']} subscription has expired",
            'data' => ['subscription_id' => $this->data['subscription_id']],
            'priority' => 'high',
            'color' => '#ef4444',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push', 'email'];
    }
}
