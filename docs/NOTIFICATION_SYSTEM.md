# Notification System Architecture Guide

## Overview

The notification system uses a **channel-based strategy pattern** that allows you to:
- Send notifications through multiple channels (Email, Push, SMS, WhatsApp)
- Easily add new channels without modifying existing code
- Respect user preferences per channel
- Track notification delivery

## Architecture Components

### 1. **NotificationChannel Interface** (`Contracts/NotificationChannel.php`)
Base contract all channels must implement:
```php
interface NotificationChannel {
    public function send(User $user, array $notification): bool;
    public function isEnabledFor(User $user): bool;
    public function getName(): string;
    public function canSend(User $user): bool;
}
```

### 2. **Channels** (`Channels/`)
- `EmailChannel` - Sends email notifications
- `PushChannel` - Stores in-app notifications (ready for FCM integration)
- `SMSChannel` - SMS notifications (stub for Twilio/AWS SNS)
- `WhatsAppChannel` - WhatsApp notifications (stub for WhatsApp Business API)

### 3. **NotificationDispatcher** (`NotificationDispatcher.php`)
Routes notifications to appropriate channels based on:
- User preferences
- Channel availability
- Preferred channels per event

### 4. **NotificationEvent** (`Events/NotificationEvent.php`)
Abstract base class for domain events:
```php
abstract class NotificationEvent {
    abstract public function getNotificationData(): array;
    public function getPreferredChannels(): array;
}
```

### 5. **Specific Events**
- `SubscriptionCreatedEvent`
- `SubscriptionExpiringEvent`
- `PaymentReceivedEvent`

## Usage Examples

### Dispatching a Notification Event

```php
use App\Notifications\Events\SubscriptionCreatedEvent;
use App\Services\NotificationService;

$service = new NotificationService();

$event = new SubscriptionCreatedEvent($user, [
    'subscription_id' => $subscription->id,
    'plan_name' => $subscription->plan->name,
]);

$results = $service->dispatchEvent($event);
// Returns: ['email' => true, 'push' => true, 'sms' => false, 'whatsapp' => false]
```

### Creating a New Notification Event

1. Create event class in `app/Notifications/Events/`:

```php
<?php

namespace App\Notifications\Events;

class MyCustomEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'my_custom_event',
            'title' => 'Custom Title',
            'message' => 'Custom message: ' . $this->data['detail'],
            'data' => ['custom_id' => $this->data['id']],
            'priority' => 'normal',
            'color' => '#3b82f6',
        ];
    }

    public function getPreferredChannels(): array
    {
        return ['email', 'push']; // Only send via these channels
    }
}
```

2. Use it:

```php
$event = new MyCustomEvent($user, ['id' => 123, 'detail' => 'Something happened']);
$service->dispatchEvent($event);
```

### Adding a New Channel

1. Create channel class in `app/Notifications/Channels/`:

```php
<?php

namespace App\Notifications\Channels;

use App\Models\User;
use App\Notifications\Contracts\NotificationChannel;

class TelegramChannel implements NotificationChannel
{
    public function send(User $user, array $notification): bool
    {
        if (!$this->canSend($user)) {
            return false;
        }

        try {
            // Integrate with Telegram Bot API
            $this->sendToTelegram($user->telegram_id, $notification['message']);
            return true;
        } catch (\Exception $e) {
            \Log::error('Telegram notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function isEnabledFor(User $user): bool
    {
        return $user->notificationSettings()
            ->where('channel', 'telegram')
            ->where('enabled', true)
            ->exists();
    }

    public function getName(): string
    {
        return 'telegram';
    }

    public function canSend(User $user): bool
    {
        return !empty($user->telegram_id) && $this->isEnabledFor($user);
    }

    private function sendToTelegram(string $chatId, string $message): void
    {
        // Implementation here
    }
}
```

2. Register in `NotificationDispatcher::registerChannels()`:

```php
private function registerChannels(): void
{
    $this->channels = [
        'email' => new EmailChannel(),
        'push' => new PushChannel(),
        'sms' => new SMSChannel(),
        'whatsapp' => new WhatsAppChannel(),
        'telegram' => new TelegramChannel(), // Add this
    ];
}
```

## Database Schema

### notification_settings table
```
user_id (FK)
channel (email, push, sms, whatsapp, telegram, etc.)
enabled (boolean)
unique(user_id, channel)
```

### notifications table (existing)
```
type
title
message
data (JSON)
user_id (FK)
read_at
priority
color
timestamps
```

## User Preferences

Users can manage their notification preferences via:
- Settings > Notifications page
- API endpoint: `PATCH /settings/notifications`

Each user has independent preferences per channel.

## Integration Steps

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Notification Settings
```bash
php artisan db:seed --class=NotificationSettingSeeder
```

### 3. Update Your Models

Add to models that trigger notifications:

```php
// In Subscription model
protected static function created(self $subscription)
{
    if ($subscription->member->user) {
        $event = new SubscriptionCreatedEvent($subscription->member->user, [
            'subscription_id' => $subscription->id,
            'plan_name' => $subscription->plan->name,
        ]);
        
        app(NotificationService::class)->dispatchEvent($event);
    }
}
```

### 4. Configure Email (if using EmailChannel)

Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@gympro.local
```

## Future Integrations

### SMS (Twilio)
```bash
composer require twilio/sdk
```

### WhatsApp (Twilio)
```bash
composer require twilio/sdk
```

### Push Notifications (Firebase)
```bash
composer require kreait/firebase-php
```

### Telegram
```bash
composer require irazasyed/telegram-bot-sdk
```

## Best Practices

1. **Always use Events** - Don't call channels directly
2. **Respect User Preferences** - Check `isEnabledFor()` before sending
3. **Log Failures** - All channels log errors for debugging
4. **Queue Long Operations** - Wrap in jobs for email/SMS
5. **Test Channels** - Each channel should have unit tests
6. **Validate Data** - Ensure user has required fields (email, phone, etc.)

## Testing

```php
public function test_subscription_created_notification()
{
    $user = User::factory()->create();
    $subscription = Subscription::factory()->create();

    $event = new SubscriptionCreatedEvent($user, [
        'subscription_id' => $subscription->id,
        'plan_name' => 'Premium',
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
```

## Troubleshooting

### Notifications not sending?
1. Check `notification_settings` table - ensure channel is enabled for user
2. Check user has required field (email, phone, etc.)
3. Check logs: `storage/logs/laravel.log`
4. Verify channel implementation

### Email not working?
1. Test mail config: `php artisan tinker` → `Mail::raw('test', fn($m) => $m->to('test@test.com'))`
2. Check `.env` mail settings
3. Verify email template exists: `resources/views/emails/notification.blade.php`

### Adding new channel not working?
1. Ensure class implements `NotificationChannel` interface
2. Register in `NotificationDispatcher::registerChannels()`
3. Add migration for user preferences if needed
4. Test `canSend()` returns true for test user
