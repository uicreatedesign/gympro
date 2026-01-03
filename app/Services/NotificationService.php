<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationSetting;
use App\Models\User;

class NotificationService
{
    private static function isEnabled(string $eventType): bool
    {
        $setting = NotificationSetting::where('event_type', $eventType)
            ->where('channel', 'in_app')
            ->first();
        
        return $setting ? $setting->enabled : true;
    }

    public static function create(array $data)
    {
        if (!self::isEnabled($data['type'])) {
            return null;
        }

        return Notification::create([
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'user_id' => $data['user_id'] ?? null,
            'priority' => $data['priority'] ?? 'normal',
            'icon' => $data['icon'] ?? null,
            'color' => $data['color'] ?? '#3b82f6',
        ]);
    }

    public static function createForUser(User $user, array $data)
    {
        return self::create(array_merge($data, ['user_id' => $user->id]));
    }

    public static function createSystemWide(array $data)
    {
        return self::create(array_merge($data, ['user_id' => null]));
    }

    public static function subscriptionExpiring($subscription)
    {
        if ($subscription->member->user_id) {
            return self::create([
                'type' => 'subscription_expiring',
                'title' => 'Subscription Expiring Soon',
                'message' => "Your subscription will expire on {$subscription->end_date}",
                'data' => ['subscription_id' => $subscription->id],
                'user_id' => $subscription->member->user_id,
                'priority' => 'high',
                'color' => '#f59e0b',
            ]);
        }
    }

    public static function paymentReceived($payment)
    {
        if ($payment->subscription->member->user_id) {
            return self::create([
                'type' => 'payment_received',
                'title' => 'Payment Received',
                'message' => "Payment of ₹{$payment->amount} received successfully",
                'data' => ['payment_id' => $payment->id],
                'user_id' => $payment->subscription->member->user_id,
                'priority' => 'normal',
                'color' => '#10b981',
            ]);
        }
    }

    public static function subscriptionCreated($subscription)
    {
        if ($subscription->member->user_id) {
            return self::create([
                'type' => 'subscription_created',
                'title' => 'Subscription Created',
                'message' => "Your {$subscription->plan->name} subscription has been activated",
                'data' => ['subscription_id' => $subscription->id],
                'user_id' => $subscription->member->user_id,
                'priority' => 'normal',
                'color' => '#3b82f6',
            ]);
        }
    }
}
