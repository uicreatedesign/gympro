<?php

namespace App\Notifications\Events;

class PaymentReceivedEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'payment_received',
            'title' => 'Payment Received',
            'message' => "Payment of ₹{$this->data['amount']} received successfully",
            'data' => ['payment_id' => $this->data['payment_id']],
            'priority' => 'normal',
            'color' => '#10b981',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push', 'email'];
    }
}
