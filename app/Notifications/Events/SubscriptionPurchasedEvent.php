<?php

namespace App\Notifications\Events;

class SubscriptionPurchasedEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'subscription_purchased',
            'title' => 'Subscription Purchased',
            'message' => "New subscription purchased: {$this->data['plan_name']} by {$this->data['member_name']}",
            'data' => [
                'subscription_id' => $this->data['subscription_id'],
                'payment_id' => $this->data['payment_id'],
                'amount' => $this->data['amount'],
            ],
            'priority' => 'high',
            'color' => '#10b981',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push', 'email'];
    }
}
