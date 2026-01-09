<?php

namespace App\Notifications\Events;

class SubscriptionCreatedEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'subscription_created',
            'title' => 'Subscription Created',
            'message' => "Your {$this->data['plan_name']} subscription has been activated",
            'data' => ['subscription_id' => $this->data['subscription_id']],
            'priority' => 'normal',
            'color' => '#3b82f6',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push', 'email'];
    }
}
