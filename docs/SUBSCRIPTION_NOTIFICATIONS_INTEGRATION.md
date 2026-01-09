# Subscription Notifications Integration Guide

## Current State Analysis

Your `SubscriptionService` already has basic notifications, but they're using the old system. We need to migrate to the new **event-driven notification system** for better scalability.

### Current Implementation Issues:
1. ❌ Notifications hardcoded in service methods
2. ❌ Only in-app notifications (no email/push/SMS/WhatsApp)
3. ❌ No user preference checking
4. ❌ Difficult to add new channels
5. ❌ No event-based architecture

### New Implementation Benefits:
1. ✅ Event-driven architecture
2. ✅ Multi-channel support (Email, Push, SMS, WhatsApp)
3. ✅ Respects user preferences
4. ✅ Easy to extend with new channels
5. ✅ Clean separation of concerns

---

## Step 1: Create Subscription Notification Events

Create these event classes in `app/Notifications/Events/`:

### SubscriptionCreatedEvent.php
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

### SubscriptionExpiringEvent.php
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

### SubscriptionExpiredEvent.php
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

## Step 2: Update Subscription Model

Add model events to trigger notifications:

```php
<?php

namespace App\Models;

use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    // ... existing code ...

    protected static function booted()
    {
        static::created(function (self $subscription) {
            self::notifySubscriptionCreated($subscription);
        });

        static::updating(function (self $subscription) {
            // Notify when status changes to expired
            if ($subscription->isDirty('status') && $subscription->status === 'expired') {
                self::notifySubscriptionExpired($subscription);
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
}
```

---

## Step 3: Update SubscriptionService

Replace the old notification calls with new event-driven approach:

```php
<?php

namespace App\Services;

use App\Models\Subscription;
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Notifications\Events\SubscriptionExpiringEvent;
use App\Notifications\Events\SubscriptionExpiredEvent;
use App\Services\NotificationService;

class SubscriptionService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Create a new subscription
     */
    public function createSubscription(array $data): Subscription
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $startDate = Carbon::parse($data['start_date']);
        $data['end_date'] = $startDate->copy()->addMonths($plan->duration_months);

        $subscription = Subscription::create($data);
        
        // Model event will trigger notification automatically
        // No need to manually call notification here

        // Auto-create payment if provided
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

    /**
     * Check and update expired subscriptions
     */
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

    /**
     * Send expiring soon notifications
     */
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

    // ... rest of existing methods ...
}
```

---

## Step 4: Create Artisan Command for Scheduled Notifications

Create `app/Console/Commands/SendSubscriptionNotifications.php`:

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

Register in `app/Console/Kernel.php`:

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

## Step 5: Create Command to Update Expired Subscriptions

Create `app/Console/Commands/UpdateExpiredSubscriptions.php`:

```php
<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class UpdateExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:update-expired';
    protected $description = 'Update subscriptions that have expired';

    public function handle(SubscriptionService $subscriptionService)
    {
        $expiredCount = $subscriptionService->updateExpiredSubscriptions();
        
        $this->info("Updated {$expiredCount} expired subscriptions");
    }
}
```

---

## Step 6: Update Payment Model for Payment Notifications

Update `app/Models/Payment.php`:

```php
<?php

namespace App\Models;

use App\Notifications\Events\PaymentReceivedEvent;
use App\Services\NotificationService;

class Payment extends Model
{
    // ... existing code ...

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

    // ... rest of existing code ...
}
```

---

## Step 7: Database Migration (if needed)

If you need to track which subscriptions have been notified about expiration:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->timestamp('expiring_notification_sent_at')->nullable()->after('end_date');
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('expiring_notification_sent_at');
        });
    }
};
```

---

## Step 8: Testing

Create test file `tests/Feature/SubscriptionNotificationTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\Subscription;
use App\Models\Member;
use App\Models\Plan;
use App\Models\User;
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;
use Tests\TestCase;

class SubscriptionNotificationTest extends TestCase
{
    public function test_subscription_created_sends_notification()
    {
        $user = User::factory()->create();
        $member = Member::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create();

        $subscription = Subscription::create([
            'member_id' => $member->id,
            'plan_id' => $plan->id,
            'start_date' => now(),
            'end_date' => now()->addMonths($plan->duration_months),
            'status' => 'active',
        ]);

        // Check in-app notification was created
        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'subscription_created',
        ]);
    }

    public function test_subscription_expiring_notification()
    {
        $user = User::factory()->create();
        $member = Member::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create();

        $subscription = Subscription::create([
            'member_id' => $member->id,
            'plan_id' => $plan->id,
            'start_date' => now()->subMonths(11),
            'end_date' => now()->addDays(5),
            'status' => 'active',
        ]);

        $service = app(NotificationService::class);
        $service->notifyExpiringSubscriptions(7);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'subscription_expiring',
        ]);
    }

    public function test_subscription_expired_sends_notification()
    {
        $user = User::factory()->create();
        $member = Member::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create();

        $subscription = Subscription::create([
            'member_id' => $member->id,
            'plan_id' => $plan->id,
            'start_date' => now()->subMonths(12),
            'end_date' => now()->subDay(),
            'status' => 'active',
        ]);

        $service = app(NotificationService::class);
        $service->updateExpiredSubscriptions();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'subscription_expired',
        ]);
    }
}
```

---

## Summary of Changes

| Event | Old System | New System |
|-------|-----------|-----------|
| **Subscription Created** | In-app only | Email + Push + SMS + WhatsApp |
| **Subscription Expiring** | Manual call needed | Scheduled command |
| **Subscription Expired** | In-app only | Email + Push + SMS + WhatsApp |
| **Payment Received** | In-app only | Email + Push + SMS + WhatsApp |
| **User Control** | None | Full preferences per channel |
| **Extensibility** | Hard to add channels | Easy to add new channels |

---

## Implementation Checklist

- [ ] Create subscription notification events
- [ ] Update Subscription model with booted() method
- [ ] Update SubscriptionService
- [ ] Create artisan commands
- [ ] Register commands in Kernel.php
- [ ] Update Payment model
- [ ] Run migrations
- [ ] Test notifications
- [ ] Configure email settings
- [ ] Set up scheduled tasks

---

## Next Steps

1. **Email Integration**: Configure SMTP in `.env`
2. **SMS Integration**: Add Twilio SDK when ready
3. **WhatsApp Integration**: Add WhatsApp Business API when ready
4. **Push Notifications**: Integrate Firebase Cloud Messaging
5. **Monitoring**: Set up logging and monitoring for notifications
