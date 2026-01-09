# Notification System Integration Guide

## Quick Start

### 1. Setup
```bash
php artisan migrate
php artisan db:seed --class=NotificationSettingSeeder
```

### 2. Dispatch Notifications in Your Models

#### Example: Subscription Model
```php
<?php

namespace App\Models;

use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected static function booted()
    {
        static::created(function (self $subscription) {
            if ($subscription->member->user) {
                $event = new SubscriptionCreatedEvent($subscription->member->user, [
                    'subscription_id' => $subscription->id,
                    'plan_name' => $subscription->plan->name,
                    'member_name' => $subscription->member->name,
                ]);
                
                app(NotificationService::class)->dispatchEvent($event);
            }
        });
    }
}
```

#### Example: Payment Model
```php
<?php

namespace App\Models;

use App\Notifications\Events\PaymentReceivedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected static function booted()
    {
        static::created(function (self $payment) {
            if ($payment->status === 'completed' && $payment->user) {
                $event = new PaymentReceivedEvent($payment->user, [
                    'payment_id' => $payment->id,
                    'amount' => $payment->amount,
                    'subscription_id' => $payment->subscription_id,
                ]);
                
                app(NotificationService::class)->dispatchEvent($event);
            }
        });
    }
}
```

#### Example: Attendance Model
```php
<?php

namespace App\Models;

use App\Notifications\Events\AttendanceMarkedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected static function booted()
    {
        static::created(function (self $attendance) {
            if ($attendance->member->user) {
                $event = new AttendanceMarkedEvent($attendance->member->user, [
                    'attendance_id' => $attendance->id,
                    'member_name' => $attendance->member->name,
                    'date' => $attendance->date,
                ]);
                
                app(NotificationService::class)->dispatchEvent($event);
            }
        });
    }
}
```

### 3. Create Event Classes

#### Example: SubscriptionCreatedEvent
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
            'message' => "New subscription for {$this->data['member_name']} - {$this->data['plan_name']}",
            'data' => [
                'subscription_id' => $this->data['subscription_id'],
                'plan_name' => $this->data['plan_name'],
            ],
            'priority' => 'high',
            'color' => '#10b981',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['email', 'push'];
    }
}
```

#### Example: PaymentReceivedEvent
```php
<?php

namespace App\Notifications\Events;

class PaymentReceivedEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'payment_received',
            'title' => 'Payment Received',
            'message' => "Payment of {$this->data['amount']} received successfully",
            'data' => [
                'payment_id' => $this->data['payment_id'],
                'amount' => $this->data['amount'],
            ],
            'priority' => 'normal',
            'color' => '#3b82f6',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['email', 'push'];
    }
}
```

#### Example: AttendanceMarkedEvent
```php
<?php

namespace App\Notifications\Events;

class AttendanceMarkedEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'attendance_marked',
            'title' => 'Attendance Marked',
            'message' => "Attendance marked for {$this->data['member_name']} on {$this->data['date']}",
            'data' => [
                'attendance_id' => $this->data['attendance_id'],
                'date' => $this->data['date'],
            ],
            'priority' => 'low',
            'color' => '#8b5cf6',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['push'];
    }
}
```

## Checking User Preferences

### Method 1: Direct Query
```php
use App\Models\NotificationSetting;

$user = auth()->user();

// Check if user wants email for subscription_created
$wantsEmail = NotificationSetting::where('user_id', $user->id)
    ->where('event_type', 'subscription_created')
    ->where('channel', 'email')
    ->where('enabled', true)
    ->exists();

if ($wantsEmail) {
    // Send email
}
```

### Method 2: Using Dispatcher
```php
use App\Notifications\NotificationDispatcher;

$dispatcher = new NotificationDispatcher();
$availableChannels = $dispatcher->getAvailableChannels($user);

// $availableChannels is array of enabled channels for user
foreach ($availableChannels as $channelName => $channel) {
    // Use channel
}
```

## Adding New Event Types

### Step 1: Add to Controller Constants
```php
// In NotificationSettingController
private const EVENTS = [
    'member_registered' => 'Member Registered',
    'subscription_created' => 'Subscription Created',
    'my_new_event' => 'My New Event', // Add here
];
```

### Step 2: Create Event Class
```php
<?php

namespace App\Notifications\Events;

class MyNewEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'my_new_event',
            'title' => 'My Event Title',
            'message' => 'Event message: ' . $this->data['detail'],
            'data' => $this->data,
            'priority' => 'normal',
            'color' => '#3b82f6',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['email', 'push'];
    }
}
```

### Step 3: Use in Your Code
```php
use App\Notifications\Events\MyNewEvent;
use App\Services\NotificationService;

$event = new MyNewEvent($user, [
    'detail' => 'Something happened',
    'id' => 123,
]);

app(NotificationService::class)->dispatchEvent($event);
```

## Testing

### Manual Testing
1. Go to Settings → Notifications
2. Toggle channels for events
3. Click "Test" button for each channel
4. Verify notifications are received

### Automated Testing
```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscription_created_notification()
    {
        $user = User::factory()->create();
        
        $event = new SubscriptionCreatedEvent($user, [
            'subscription_id' => 1,
            'plan_name' => 'Premium',
            'member_name' => 'John Doe',
        ]);

        $service = new NotificationService();
        $results = $service->dispatchEvent($event);

        $this->assertTrue($results['push']);
        $this->assertTrue($results['email']);
        
        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'subscription_created',
        ]);
    }

    public function test_respects_user_preferences()
    {
        $user = User::factory()->create();
        
        // Disable email for subscription_created
        NotificationSetting::updateOrCreate(
            [
                'user_id' => $user->id,
                'event_type' => 'subscription_created',
                'channel' => 'email',
            ],
            ['enabled' => false]
        );

        $event = new SubscriptionCreatedEvent($user, [
            'subscription_id' => 1,
            'plan_name' => 'Premium',
            'member_name' => 'John Doe',
        ]);

        $service = new NotificationService();
        $results = $service->dispatchEvent($event);

        $this->assertFalse($results['email']);
    }
}
```

## Troubleshooting

### Notifications not sending
1. Check `notification_settings` table for user preferences
2. Verify event class implements `NotificationEvent`
3. Check `notifications` table for in-app notifications
4. Review logs: `storage/logs/laravel.log`

### Email not working
1. Verify SMTP settings in `.env`
2. Test with: `php artisan tinker` → `Mail::raw('test', fn($m) => $m->to('test@test.com'))`
3. Check email template: `resources/views/emails/notification.blade.php`

### Settings not persisting
1. Verify user is authenticated
2. Check `notification_settings` table exists
3. Verify unique constraint: `(user_id, event_type, channel)`

## Performance Tips

1. **Cache User Preferences**: Consider caching notification settings per request
2. **Queue Notifications**: Use Laravel queues for email/SMS
3. **Batch Notifications**: Group similar notifications
4. **Lazy Load**: Only fetch settings when needed

Example with caching:
```php
use Illuminate\Support\Facades\Cache;

$settings = Cache::remember(
    "user.{$user->id}.notification_settings",
    3600,
    function () use ($user) {
        return NotificationSetting::where('user_id', $user->id)
            ->get()
            ->groupBy('event_type')
            ->map(fn($events) => $events->pluck('enabled', 'channel'))
            ->toArray();
    }
);
```

## Best Practices

1. ✅ Always use events, never call channels directly
2. ✅ Respect user preferences in dispatcher
3. ✅ Log all notification attempts
4. ✅ Validate user has required fields (email, phone)
5. ✅ Test channels before relying on them
6. ✅ Use meaningful event names
7. ✅ Include relevant data in notifications
8. ✅ Set appropriate priority levels

## Support

For detailed architecture information, see:
- `NOTIFICATION_SYSTEM.md` - System overview
- `NOTIFICATION_ARCHITECTURE.md` - Design patterns
- `NOTIFICATION_SETUP_GUIDE.md` - Setup instructions
