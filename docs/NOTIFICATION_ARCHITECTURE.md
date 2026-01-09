# Notification System Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION EVENTS                          │
│  (Subscription Created, Payment Received, etc.)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NotificationEvent (Abstract)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ - getNotificationData(): array                          │   │
│  │ - getPreferredChannels(): array                         │   │
│  │ - getUser(): User                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Concrete Events:                                               │
│  ├─ SubscriptionCreatedEvent                                   │
│  ├─ SubscriptionExpiringEvent                                  │
│  ├─ PaymentReceivedEvent                                       │
│  └─ (Add more as needed)                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NotificationService                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ dispatchEvent(NotificationEvent): array                │   │
│  │ - Stores in-app notification                           │   │
│  │ - Routes to dispatcher                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NotificationDispatcher                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ dispatch(User, array, channels[]): array               │   │
│  │ - Gets available channels for user                      │   │
│  │ - Filters by preferred channels                         │   │
│  │ - Routes to each channel                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┼────────────┬──────────────┐
                │            │            │              │
                ▼            ▼            ▼              ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │EmailChannel  │ │PushCh.   │ │SMSCh.    │ │WhatsAppCh.   │
        ├──────────────┤ ├──────────┤ ├──────────┤ ├──────────────┤
        │ send()       │ │ send()   │ │ send()   │ │ send()       │
        │ canSend()    │ │ canSend()│ │ canSend()│ │ canSend()    │
        │ isEnabledFor │ │isEnabledFor│isEnabledFor│isEnabledFor │
        └──────────────┘ └──────────┘ └──────────┘ └──────────────┘
                │            │            │              │
                ▼            ▼            ▼              ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │Mail Driver   │ │Database  │ │Twilio    │ │WhatsApp API  │
        │(SMTP/etc)    │ │(in-app)  │ │(future)  │ │(future)      │
        └──────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

## Data Flow Example: Subscription Created

```
1. Subscription Model (booted event)
   └─> SubscriptionCreatedEvent($user, $data)

2. NotificationService::dispatchEvent()
   ├─> Store in notifications table
   └─> NotificationDispatcher::dispatch()

3. NotificationDispatcher checks:
   ├─> User preferences (notification_settings)
   ├─> Channel availability (canSend())
   └─> Preferred channels from event

4. For each enabled channel:
   ├─> EmailChannel::send()
   │   └─> Mail::send() → SMTP → User Email
   │
   ├─> PushChannel::send()
   │   └─> Store in notifications table → Frontend polls
   │
   ├─> SMSChannel::send()
   │   └─> (Ready for Twilio integration)
   │
   └─> WhatsAppChannel::send()
       └─> (Ready for WhatsApp Business API)

5. Return results array
   └─> ['email' => true, 'push' => true, 'sms' => false, 'whatsapp' => false]
```

## Database Schema

```
┌─────────────────────────────────────────┐
│         notifications                   │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ type (subscription_created, etc.)       │
│ title                                   │
│ message                                 │
│ data (JSON)                             │
│ user_id (FK) → users                    │
│ read_at (nullable)                      │
│ priority (low, normal, high, urgent)    │
│ color                                   │
│ created_at, updated_at                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    notification_settings                │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK) → users                    │
│ channel (email, push, sms, whatsapp)    │
│ enabled (boolean)                       │
│ created_at, updated_at                  │
│ UNIQUE(user_id, channel)                │
└─────────────────────────────────────────┘
```

## Class Hierarchy

```
NotificationChannel (Interface)
├── EmailChannel
├── PushChannel
├── SMSChannel
└── WhatsAppChannel

NotificationEvent (Abstract)
├── SubscriptionCreatedEvent
├── SubscriptionExpiringEvent
├── PaymentReceivedEvent
└── (Your custom events)
```

## Sequence Diagram: Sending a Notification

```
User Action          Model              Service            Dispatcher         Channel
    │                 │                   │                   │                 │
    ├─ Create Sub ──> │                   │                   │                 │
    │                 ├─ Event Fired ──> │                   │                 │
    │                 │                   ├─ Store in DB ──> │                 │
    │                 │                   │                   │                 │
    │                 │                   ├─ Dispatch ──────> │                 │
    │                 │                   │                   ├─ Check Prefs ──> │
    │                 │                   │                   │                 │
    │                 │                   │                   ├─ Email ────────> │
    │                 │                   │                   │                 ├─ Send
    │                 │                   │                   │                 │
    │                 │                   │                   ├─ Push ────────> │
    │                 │                   │                   │                 ├─ Store
    │                 │                   │                   │                 │
    │                 │                   │                   ├─ SMS ────────> │
    │                 │                   │                   │                 ├─ Queue
    │                 │                   │                   │                 │
    │                 │                   │                   ├─ WhatsApp ───> │
    │                 │                   │                   │                 ├─ Queue
    │                 │                   │                   │                 │
    │                 │                   │                   <─ Results ────── │
    │                 │                   │                   │                 │
    │                 │                   <─ Results ─────── │                 │
    │                 │                   │                   │                 │
    │                 │ <─ Complete ────── │                   │                 │
    │                 │                   │                   │                 │
```

## Extension Points

### Adding a New Channel

```
1. Create Channel Class
   └─ Implement NotificationChannel interface
   └─ Implement send(), canSend(), isEnabledFor(), getName()

2. Register in NotificationDispatcher
   └─ Add to $this->channels array

3. Add User Preference (optional)
   └─ Migration to add column to notification_settings

4. Done!
   └─ All events now support new channel automatically
```

### Adding a New Event

```
1. Create Event Class
   └─ Extend NotificationEvent
   └─ Implement getNotificationData()
   └─ Implement getPreferredChannels() (optional)

2. Use in Your Code
   └─ $event = new MyEvent($user, $data)
   └─ app(NotificationService::class)->dispatchEvent($event)

3. Done!
   └─ Notification sent through all enabled channels
```

## Key Design Patterns

### 1. Strategy Pattern
Each channel is a strategy that can be swapped/added without changing dispatcher.

### 2. Observer Pattern
Model events trigger notification events.

### 3. Dependency Injection
NotificationService injected where needed.

### 4. Template Method Pattern
NotificationEvent defines template, subclasses implement specifics.

### 5. Factory Pattern
NotificationDispatcher creates and manages channel instances.

## Performance Considerations

1. **In-App Notifications**: Instant (stored in DB)
2. **Email**: Queue for async processing
3. **SMS/WhatsApp**: Queue for async processing
4. **User Preferences**: Cached per request

## Security Considerations

1. **User Isolation**: Users only see their notifications
2. **Permission Checks**: Verify user can receive notification
3. **Input Validation**: All notification data validated
4. **Rate Limiting**: Consider rate limiting per channel
5. **Sensitive Data**: Don't store sensitive data in notifications

## Monitoring & Logging

All channels log:
- Successful sends
- Failed sends with error details
- User preferences checked
- Channel availability

Check logs: `storage/logs/laravel.log`
