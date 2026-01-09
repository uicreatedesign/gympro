# Improved Notification System Setup Guide

## Overview

The notification system has been enhanced to support **event-based notification preferences** with a user-friendly matrix interface. Users can now control which notification channels (email, push, SMS, WhatsApp) are enabled for each event type.

## What's New

### 1. Event-Based Settings
Instead of just channel preferences, users can now configure notifications per event:
- Member Registered
- Subscription Created
- Subscription Expiring
- Subscription Expired
- Payment Received
- Payment Failed
- Attendance Marked

### 2. Matrix UI
A clean table interface showing all events and channels with toggle switches for easy configuration.

### 3. Test Functionality
Users can test each notification channel directly from settings to verify configuration.

### 4. Quick Actions
- Enable All: Activate all channels for all events
- Disable All: Deactivate all channels for all events
- Reset: Revert to last saved settings

## Installation Steps

### 1. Run Migration
```bash
php artisan migrate
```

This creates the `event_type` column in `notification_settings` table.

### 2. Seed Default Settings (Optional)
```bash
php artisan db:seed --class=NotificationSettingSeeder
```

This initializes notification settings for all existing users with sensible defaults:
- Email: Enabled
- Push: Enabled
- SMS: Disabled
- WhatsApp: Disabled

### 3. Clear Cache (if applicable)
```bash
php artisan cache:clear
```

## Database Schema

### notification_settings table
```
id (PK)
user_id (FK) → users
event_type (string) - Event identifier
channel (string) - email, push, sms, whatsapp
enabled (boolean) - Whether this channel is enabled for this event
UNIQUE(user_id, event_type, channel)
timestamps
```

## Usage

### For Users
1. Navigate to Settings > Notifications
2. View the event-channel matrix
3. Toggle channels on/off for each event
4. Use "Test" button to verify channel configuration
5. Click "Save Settings" to persist changes

### For Developers

#### Checking User Preferences
```php
use App\Models\NotificationSetting;

$user = auth()->user();

// Check if email is enabled for subscription_created event
$isEnabled = NotificationSetting::where('user_id', $user->id)
    ->where('event_type', 'subscription_created')
    ->where('channel', 'email')
    ->where('enabled', true)
    ->exists();
```

#### Dispatching Notifications
```php
use App\Services\NotificationService;
use App\Notifications\Events\SubscriptionCreatedEvent;

$event = new SubscriptionCreatedEvent($user, [
    'subscription_id' => $subscription->id,
    'plan_name' => $subscription->plan->name,
]);

app(NotificationService::class)->dispatchEvent($event);
```

The dispatcher automatically respects user preferences from `notification_settings`.

#### Adding New Events
1. Add event key to `NotificationSettingController::EVENTS` constant
2. Create event class in `app/Notifications/Events/`
3. Implement `getNotificationData()` and `getPreferredChannels()`
4. Use in your code

Example:
```php
// In NotificationSettingController
private const EVENTS = [
    'member_registered' => 'Member Registered',
    'subscription_created' => 'Subscription Created',
    'my_new_event' => 'My New Event', // Add here
];

// Create app/Notifications/Events/MyNewEvent.php
class MyNewEvent extends NotificationEvent
{
    public function getNotificationData(): array
    {
        return [
            'type' => 'my_new_event',
            'title' => 'My Event',
            'message' => 'Something happened',
            'data' => [],
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

## API Endpoints

### Get Notification Settings
```
GET /settings/notifications
```

Returns current user's notification settings organized by event and channel.

### Update Notification Settings
```
POST /settings/notifications
Content-Type: application/json

{
    "settings": {
        "member_registered": {
            "email": true,
            "push": true,
            "sms": false,
            "whatsapp": false
        },
        "subscription_created": {
            "email": true,
            "push": true,
            "sms": false,
            "whatsapp": false
        },
        ...
    }
}
```

### Test Notification Channel
```
POST /settings/notifications/test
Content-Type: application/json

{
    "channel": "email"
}
```

Response:
```json
{
    "success": true,
    "message": "Test email notification sent"
}
```

## Notification Channels

### Email
- Status: ✅ Fully Implemented
- Requires: SMTP configuration in `.env`
- Test: Sends test email to user's email address

### Push (In-App)
- Status: ✅ Fully Implemented
- Requires: None (stored in database)
- Test: Creates test notification in database

### SMS
- Status: 🔄 Ready for Integration
- Requires: Twilio or AWS SNS setup
- Implementation: Update `SMSChannel::send()` method

### WhatsApp
- Status: 🔄 Ready for Integration
- Requires: WhatsApp Business API setup
- Implementation: Update `WhatsAppChannel::send()` method

## Troubleshooting

### Settings not saving
1. Check user has `auth` middleware applied
2. Verify `notification_settings` table exists
3. Check Laravel logs: `storage/logs/laravel.log`

### Test notification not working
1. For email: Verify SMTP settings in `.env`
2. For push: Check `notifications` table for new record
3. Check user email/phone is configured

### Events not triggering notifications
1. Verify event class extends `NotificationEvent`
2. Check `getNotificationData()` returns required fields
3. Verify `NotificationService::dispatchEvent()` is called
4. Check user preferences in `notification_settings` table

## Performance Considerations

- Settings are queried per request (consider caching if needed)
- Test notifications are sent synchronously (consider queuing for production)
- Matrix UI renders efficiently with React memoization

## Security

- All endpoints require authentication
- Users can only modify their own settings
- Input validation on all API endpoints
- CSRF protection enabled

## Future Enhancements

1. **Notification History**: Track sent notifications
2. **Frequency Limits**: Prevent notification spam
3. **Quiet Hours**: Set times when notifications are muted
4. **Notification Templates**: Customize message content
5. **Batch Notifications**: Group similar notifications
6. **Mobile Push**: Firebase Cloud Messaging integration
7. **Webhook Logs**: Track delivery status

## Support

For issues or questions:
1. Check logs: `storage/logs/laravel.log`
2. Review NOTIFICATION_SYSTEM.md for architecture details
3. Check NOTIFICATION_ARCHITECTURE.md for design patterns
