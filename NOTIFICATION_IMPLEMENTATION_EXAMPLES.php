<?php

namespace App\Models;

use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;

/**
 * EXAMPLE: How to integrate notifications into your models
 * 
 * Add these methods to your Subscription model (or any model that triggers notifications)
 */

class SubscriptionExample extends Model
{
    protected static function booted()
    {
        static::created(function (self $subscription) {
            self::notifySubscriptionCreated($subscription);
        });

        static::updating(function (self $subscription) {
            if ($subscription->isDirty('end_date')) {
                self::notifySubscriptionExpiring($subscription);
            }
        });
    }

    private static function notifySubscriptionCreated(self $subscription): void
    {
        if (!$subscription->member->user) {
            return;
        }

        $event = new SubscriptionCreatedEvent($subscription->member->user, [
            'subscription_id' => $subscription->id,
            'plan_name' => $subscription->plan->name,
        ]);

        app(NotificationService::class)->dispatchEvent($event);
    }

    private static function notifySubscriptionExpiring(self $subscription): void
    {
        if (!$subscription->member->user) {
            return;
        }

        $event = new SubscriptionExpiringEvent($subscription->member->user, [
            'subscription_id' => $subscription->id,
            'end_date' => $subscription->end_date->format('Y-m-d'),
        ]);

        app(NotificationService::class)->dispatchEvent($event);
    }
}

/**
 * EXAMPLE: How to use in controllers
 */

class PaymentController
{
    public function store(Request $request)
    {
        $payment = Payment::create($request->validated());

        // Dispatch notification event
        $event = new PaymentReceivedEvent($payment->subscription->member->user, [
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
        ]);

        app(NotificationService::class)->dispatchEvent($event);

        return redirect()->back()->with('success', 'Payment recorded');
    }
}

/**
 * EXAMPLE: How to use in commands/jobs
 */

class SendExpiringSubscriptionNotifications
{
    public function handle()
    {
        $expiringSubscriptions = Subscription::where('end_date', '<=', now()->addDays(7))
            ->where('end_date', '>', now())
            ->get();

        foreach ($expiringSubscriptions as $subscription) {
            if (!$subscription->member->user) {
                continue;
            }

            $event = new SubscriptionExpiringEvent($subscription->member->user, [
                'subscription_id' => $subscription->id,
                'end_date' => $subscription->end_date->format('Y-m-d'),
            ]);

            app(NotificationService::class)->dispatchEvent($event);
        }
    }
}
