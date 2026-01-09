# Notification System - Quick Start

## What Was Built

A **scalable, extensible notification system** using the Strategy Pattern that supports:
- ✅ Email notifications (ready to use)
- ✅ Push notifications (in-app, ready for FCM)
- 🔄 SMS notifications (stub, ready for Twilio/AWS SNS)
- 🔄 WhatsApp notifications (stub, ready for WhatsApp Business API)
- 🔄 Easy to add more channels (Telegram, Slack, etc.)

## Key Files Created

### Core Architecture
```
app/Notifications/
├── Contracts/
│   └── NotificationChannel.php          # Interface all channels implement
├── Channels/
│   ├── EmailChannel.php                 # Email implementation
│   ├── PushChannel.php                  # In-app push implementation
│   ├── SMSChannel.php                   # SMS stub (ready for integration)
│   └── WhatsAppChannel.php              # WhatsApp stub (ready for integration)
├── Events/
│   ├── NotificationEvent.php            # Base event class
│   ├── SubscriptionCreatedEvent.php     # Example event
│   ├── SubscriptionExpiringEvent.php    # Example event
│   └── PaymentReceivedEvent.php         # Example event
└── NotificationDispatcher.php           # Routes to channels
```

### Database
```
database/migrations/
└── 2026_01_15_000000_restructure_notification_settings.php

database/seeders/
└── NotificationSettingSeeder.php
```

### Views & Documentation
```
resources/views/emails/
└── notification.blade.php               # Email template

NOTIFICATION_SYSTEM.md                   # Full documentation
NOTIFICATION_IMPLEMENTATION_EXAMPLES.php # Code examples
```

## Setup (5 minutes)

### 1. Run Migration
```bash
php artisan migrate
```

### 2. Seed Notification Settings
```bash
php artisan db:seed --class=NotificationSettingSeeder
```

### 3. Configure Email (if using)
Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@gympro.local
```

### 4. Update Your Models
Add to models that trigger notifications (see `NOTIFICATION_IMPLEMENTATION_EXAMPLES.php`):

```php
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;

protected static function booted()
{
    static::created(function (self $subscription) {
        if ($subscription->member->user) {
            $event = new SubscriptionCreatedEvent($subscription->member->user, [
                'subscription_id' => $subscription->id,
                'plan_name' => $subscription->plan->name,
            ]);
            
            app(NotificationService::class)->dispatchEvent($event);
        }
    });
}
```

## How It Works

### 1. Event Triggered
```php
$event = new SubscriptionCreatedEvent($user, ['subscription_id' => 1, 'plan_name' => 'Premium']);
```

### 2. Dispatcher Routes to Channels
```php
$service->dispatchEvent($event);
// Checks user preferences and sends via enabled channels
```

### 3. Each Channel Handles Delivery
- **EmailChannel**: Sends email via configured mail driver
- **PushChannel**: Stores in-app notification (ready for FCM)
- **SMSChannel**: Ready for Twilio/AWS SNS integration
- **WhatsAppChannel**: Ready for WhatsApp Business API integration

### 4. Results Returned
```php
[
    'email' => true,      // Successfully sent
    'push' => true,       // Successfully stored
    'sms' => false,       // User disabled or no phone
    'whatsapp' => false   // User disabled or no phone
]
```

## Adding a New Channel (Future)

### Example: Telegram Channel

1. Create `app/Notifications/Channels/TelegramChannel.php`:
```php
class TelegramChannel implements NotificationChannel {
    public function send(User $user, array $notification): bool {
        // Your Telegram API integration
    }
    // ... implement other methods
}
```

2. Register in `NotificationDispatcher::registerChannels()`:
```php
$this->channels['telegram'] = new TelegramChannel();
```

3. Add migration for user preferences (if needed)

4. Done! All events now support Telegram automatically.

## User Preferences

Users manage preferences at: **Settings > Notifications**

Each user can enable/disable per channel:
- Email
- Push
- SMS
- WhatsApp
- (Any new channels you add)

## Testing

```php
public function test_subscription_created_sends_notifications()
{
    $user = User::factory()->create();
    $subscription = Subscription::factory()->create();

    $event = new SubscriptionCreatedEvent($user, [
        'subscription_id' => $subscription->id,
        'plan_name' => 'Premium',
    ]);

    $results = app(NotificationService::class)->dispatchEvent($event);

    $this->assertTrue($results['push']);
    $this->assertTrue($results['email']);
    
    $this->assertDatabaseHas('notifications', [
        'user_id' => $user->id,
        'type' => 'subscription_created',
    ]);
}
```

## Next Steps

1. **Email**: Test with Mailtrap or your mail provider
2. **SMS**: Integrate Twilio SDK when ready
3. **WhatsApp**: Integrate WhatsApp Business API when ready
4. **Push**: Integrate Firebase Cloud Messaging when ready
5. **More Events**: Create new event classes as needed

## Architecture Benefits

✅ **Open/Closed Principle** - Open for extension, closed for modification
✅ **Single Responsibility** - Each channel handles one thing
✅ **Dependency Injection** - Easy to test and mock
✅ **User Control** - Respect user preferences per channel
✅ **Scalable** - Add channels without touching existing code
✅ **Maintainable** - Clear separation of concerns
✅ **Future-Proof** - Ready for SMS, WhatsApp, Telegram, etc.

## Support

See `NOTIFICATION_SYSTEM.md` for:
- Detailed architecture explanation
- Complete API reference
- Integration examples
- Troubleshooting guide
