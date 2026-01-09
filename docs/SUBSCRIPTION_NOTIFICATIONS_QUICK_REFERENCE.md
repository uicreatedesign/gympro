# Subscription Notifications - Quick Reference

## Files Already Updated ✅

### 1. app/Models/Subscription.php
```php
// Added imports at top
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Notifications\Events\SubscriptionExpiredEvent;
use App\Services\NotificationService;

// Added booted() method
protected static function booted()
{
    static::created(function (self $subscription) {
        self::notifySubscriptionCreated($subscription);
    });

    static::updating(function (self $subscription) {
        if ($subscription->isDirty('status') && $subscription->status === 'expired') {
            self::notifySubscriptionExpired($subscription);
        }
    });
}

// Added private methods
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

private static function notifySubscriptionExpired(self $subscription): void
{
    if (!$subscription->member->user) {
        return;
    }

    $event = new SubscriptionExpiredEvent($subscription->member->user, [
        'subscription_id' => $subscription->id,
        'plan_name' => $subscription->plan->name,
    ]);

    app(NotificationService::class)->dispatchEvent($event);
}
```

---

### 2. app/Models/Payment.php
```php
// Added imports at top
use App\Notifications\Events\PaymentReceivedEvent;
use App\Services\NotificationService;

// Updated boot() method
protected static function boot()
{
    parent::boot();
    
    static::creating(function ($payment) {
        if (!$payment->invoice_number) {
            $payment->invoice_number = self::generateInvoiceNumber();
        }
    });

    static::created(function ($payment) {
        if ($payment->status === 'completed') {
            self::notifyPaymentReceived($payment);
            \Log::info('Payment created, triggering activation', ['payment_id' => $payment->id, 'subscription_id' => $payment->subscription_id]);
            $payment->subscription->checkAndActivate();
        }
    });

    static::updated(function ($payment) {
        if ($payment->isDirty('status') && $payment->status === 'completed') {
            self::notifyPaymentReceived($payment);
            $payment->subscription->checkAndActivate();
        }
    });
}

// Added private method
private static function notifyPaymentReceived(self $payment): void
{
    if (!$payment->subscription->member->user) {
        return;
    }

    $event = new PaymentReceivedEvent($payment->subscription->member->user, [
        'payment_id' => $payment->id,
        'amount' => $payment->amount,
        'subscription_id' => $payment->subscription_id,
    ]);

    app(NotificationService::class)->dispatchEvent($event);
}
```

---

### 3. app/Services/SubscriptionService.php
```php
// Added import
use App\Notifications\Events\SubscriptionExpiringEvent;

// Updated createSubscription() - removed hardcoded notification
public function createSubscription(array $data): Subscription
{
    $plan = Plan::findOrFail($data['plan_id']);
    $startDate = Carbon::parse($data['start_date']);
    $data['end_date'] = $startDate->copy()->addMonths($plan->duration_months);

    $subscription = Subscription::create($data);
    // Model event will trigger notification automatically

    if (!empty($data['payment_amount'])) {
        $this->createPaymentForSubscription($subscription, [
            'amount' => $data['payment_amount'],
            'payment_method' => $data['payment_method'] ?? 'cash',
            'payment_type' => $data['payment_type'] ?? 'plan',
            'payment_date' => $data['payment_date'] ?? now(),
            'status' => 'completed',
        ]);
    }

    return $subscription->fresh(['member.user', 'plan', 'payments']);
}

// Updated createPaymentForSubscription() - removed hardcoded notification
public function createPaymentForSubscription(Subscription $subscription, array $paymentData): Payment
{
    $paymentData['subscription_id'] = $subscription->id;
    $paymentData['payment_source'] = 'manual';

    $payment = Payment::create($paymentData);
    // Model event will trigger notification automatically

    return $payment;
}

// Updated updateExpiredSubscriptions() - removed hardcoded notification
public function updateExpiredSubscriptions(): int
{
    $expiredCount = 0;
    $expiredSubscriptions = Subscription::where('status', 'active')
        ->where('end_date', '<', now())
        ->get();

    foreach ($expiredSubscriptions as $subscription) {
        $subscription->update(['status' => 'expired']);
        // Model event will trigger notification automatically
        $expiredCount++;
    }

    return $expiredCount;
}

// Added new method
public function notifyExpiringSubscriptions(int $days = 7): int
{
    $expiringSubscriptions = Subscription::with(['member.user', 'plan'])
        ->where('status', 'active')
        ->whereBetween('end_date', [now(), now()->addDays($days)])
        ->get();

    $notifiedCount = 0;

    foreach ($expiringSubscriptions as $subscription) {
        if (!$subscription->member->user) {
            continue;
        }

        $event = new SubscriptionExpiringEvent($subscription->member->user, [
            'subscription_id' => $subscription->id,
            'plan_name' => $subscription->plan->name,
            'end_date' => $subscription->end_date->format('Y-m-d'),
        ]);

        $this->notificationService->dispatchEvent($event);
        $notifiedCount++;
    }

    return $notifiedCount;
}
```

---

## Files Created ✅

### 1. app/Notifications/Events/SubscriptionCreatedEvent.php
```php
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
```

---

### 2. app/Notifications/Events/SubscriptionExpiringEvent.php
```php
<?php

namespace App\Notifications\Events;

class SubscriptionExpiringEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'subscription_expiring',
            'title' => 'Subscription Expiring Soon',
            'message' => "Your {$this->data['plan_name']} subscription will expire on {$this->data['end_date']}",
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
```

---

### 3. app/Notifications/Events/SubscriptionExpiredEvent.php
```php
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
```

---

### 4. app/Console/Commands/SendSubscriptionNotifications.php
```php
<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class SendSubscriptionNotifications extends Command
{
    protected $signature = 'subscriptions:notify-expiring {--days=7 : Days until expiration}';
    protected $description = 'Send notifications for subscriptions expiring soon';

    public function handle(SubscriptionService $subscriptionService)
    {
        $days = $this->option('days');
        
        $notifiedCount = $subscriptionService->notifyExpiringSubscriptions($days);
        
        $this->info("Sent {$notifiedCount} expiring subscription notifications");
    }
}
```

---

### 5. app/Console/Commands/UpdateExpiredSubscriptions.php
```php
<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class UpdateExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:update-expired';
    protected $description = 'Update subscriptions that have expired and send notifications';

    public function handle(SubscriptionService $subscriptionService)
    {
        $expiredCount = $subscriptionService->updateExpiredSubscriptions();
        
        $this->info("Updated {$expiredCount} expired subscriptions and sent notifications");
    }
}
```

---

## Configuration Required ✅

### Update app/Console/Kernel.php
```php
protected function schedule(Schedule $schedule)
{
    // Send expiring subscription notifications daily at 9 AM
    $schedule->command('subscriptions:notify-expiring --days=7')
        ->dailyAt('09:00');

    // Update expired subscriptions daily at midnight
    $schedule->command('subscriptions:update-expired')
        ->daily();
}
```

---

## Testing Commands

```bash
# Test expiring notifications
php artisan subscriptions:notify-expiring --days=7

# Test expired subscriptions
php artisan subscriptions:update-expired

# Run scheduler (for development)
php artisan schedule:work

# Run tests
php artisan test tests/Feature/SubscriptionNotificationTest.php
```

---

## Notification Flow Summary

```
Subscription Created
  ↓
Subscription::created() fires
  ↓
SubscriptionCreatedEvent dispatched
  ↓
Email + Push sent to user (if enabled)

---

Payment Completed
  ↓
Payment::created() fires
  ↓
PaymentReceivedEvent dispatched
  ↓
Email + Push sent to user (if enabled)

---

Daily at 9 AM
  ↓
subscriptions:notify-expiring runs
  ↓
SubscriptionExpiringEvent dispatched for each expiring subscription
  ↓
Email + Push sent to users (if enabled)

---

Daily at midnight
  ↓
subscriptions:update-expired runs
  ↓
Subscriptions marked as expired
  ↓
SubscriptionExpiredEvent dispatched
  ↓
Email + Push sent to users (if enabled)
```

---

## What Users Will Receive

### Email Notifications
- Subject: "Subscription Created", "Subscription Expiring Soon", "Subscription Expired", "Payment Received"
- Body: Formatted email with details
- Template: `resources/views/emails/notification.blade.php`

### Push Notifications (In-App)
- Stored in `notifications` table
- Visible in user's notification center
- Can be marked as read/deleted

### SMS & WhatsApp (Ready for Integration)
- Stubs in place
- Ready to integrate Twilio or WhatsApp Business API
- Users can enable in preferences

---

## User Preferences

Users manage at: **Settings > Notifications**

Can enable/disable:
- ✅ Email
- ✅ Push
- 🔄 SMS (ready)
- 🔄 WhatsApp (ready)

---

## Status: ✅ COMPLETE

All subscription notifications are now integrated with the new multi-channel system!
