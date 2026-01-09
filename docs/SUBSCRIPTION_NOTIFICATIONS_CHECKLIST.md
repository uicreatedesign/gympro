# Subscription Notifications - Implementation Checklist & Next Steps

## ✅ What's Already Done

### Code Changes
- [x] Created `SubscriptionCreatedEvent.php`
- [x] Created `SubscriptionExpiringEvent.php`
- [x] Created `SubscriptionExpiredEvent.php`
- [x] Updated `Subscription.php` model with booted() method
- [x] Updated `Payment.php` model with notification events
- [x] Updated `SubscriptionService.php` to use new system
- [x] Created `SendSubscriptionNotifications.php` command
- [x] Created `UpdateExpiredSubscriptions.php` command
- [x] Updated `User.php` model with relationships

### Documentation
- [x] `NOTIFICATION_SYSTEM.md` - Full architecture
- [x] `NOTIFICATION_QUICK_START.md` - Quick start guide
- [x] `NOTIFICATION_ARCHITECTURE.md` - Architecture diagrams
- [x] `SUBSCRIPTION_NOTIFICATIONS_INTEGRATION.md` - Integration guide
- [x] `SUBSCRIPTION_NOTIFICATIONS_IMPLEMENTATION.md` - Implementation summary
- [x] `SUBSCRIPTION_NOTIFICATIONS_QUICK_REFERENCE.md` - Code reference
- [x] `SUBSCRIPTION_NOTIFICATIONS_VISUAL_SUMMARY.md` - Visual guide

---

## 📋 Next Steps (Do These Now)

### Step 1: Run Migrations ⚠️ REQUIRED
```bash
php artisan migrate
```

**What it does:**
- Creates/updates `notification_settings` table
- Adds user_id and channel columns
- Sets up unique constraint on (user_id, channel)

**Verify:**
```bash
php artisan tinker
>>> DB::table('notification_settings')->first();
```

---

### Step 2: Seed Notification Settings ⚠️ REQUIRED
```bash
php artisan db:seed --class=NotificationSettingSeeder
```

**What it does:**
- Creates notification preferences for all existing users
- Sets default: email=true, push=true, sms=false, whatsapp=false

**Verify:**
```bash
php artisan tinker
>>> DB::table('notification_settings')->count();
>>> DB::table('notification_settings')->where('user_id', 1)->get();
```

---

### Step 3: Configure Email Settings (Optional but Recommended)

**Option A: Mailtrap (for testing)**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS=noreply@gympro.local
MAIL_FROM_NAME="Gympro"
```

**Option B: Gmail**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="Gympro"
```

**Option C: Your Server SMTP**
```env
MAIL_MAILER=smtp
MAIL_HOST=your.mail.server
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@gympro.local
```

**Test Email Configuration:**
```bash
php artisan tinker
>>> Mail::raw('Test email', function($m) { $m->to('test@example.com'); });
```

---

### Step 4: Register Commands in Kernel ⚠️ REQUIRED

**File:** `app/Console/Kernel.php`

```php
protected function schedule(Schedule $schedule)
{
    // Send expiring subscription notifications daily at 9 AM
    $schedule->command('subscriptions:notify-expiring --days=7')
        ->dailyAt('09:00')
        ->withoutOverlapping();

    // Update expired subscriptions daily at midnight
    $schedule->command('subscriptions:update-expired')
        ->daily()
        ->withoutOverlapping();
}
```

**Verify:**
```bash
php artisan schedule:list
```

---

### Step 5: Test Notifications Manually

**Test 1: Create a Subscription**
```bash
# Via admin panel or:
php artisan tinker
>>> $member = App\Models\Member::first();
>>> $plan = App\Models\Plan::first();
>>> $sub = App\Models\Subscription::create([
    'member_id' => $member->id,
    'plan_id' => $plan->id,
    'start_date' => now(),
    'end_date' => now()->addMonths(3),
    'status' => 'active'
]);
>>> DB::table('notifications')->where('type', 'subscription_created')->latest()->first();
```

**Test 2: Send Expiring Notifications**
```bash
php artisan subscriptions:notify-expiring --days=7
```

**Expected output:**
```
Sent X expiring subscription notifications
```

**Verify:**
```bash
php artisan tinker
>>> DB::table('notifications')->where('type', 'subscription_expiring')->latest()->first();
```

**Test 3: Update Expired Subscriptions**
```bash
php artisan subscriptions:update-expired
```

**Expected output:**
```
Updated X expired subscriptions and sent notifications
```

**Verify:**
```bash
php artisan tinker
>>> DB::table('notifications')->where('type', 'subscription_expired')->latest()->first();
```

**Test 4: Record a Payment**
```bash
php artisan tinker
>>> $subscription = App\Models\Subscription::first();
>>> $payment = App\Models\Payment::create([
    'subscription_id' => $subscription->id,
    'amount' => 5000,
    'payment_method' => 'cash',
    'payment_type' => 'plan',
    'payment_date' => now(),
    'status' => 'completed'
]);
>>> DB::table('notifications')->where('type', 'payment_received')->latest()->first();
```

---

### Step 6: Set Up Scheduler (Production)

**Option A: Crontab (Linux/Mac)**
```bash
crontab -e
```

Add this line:
```
* * * * * cd /path/to/gympro && php artisan schedule:run >> /dev/null 2>&1
```

**Option B: Windows Task Scheduler**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily
4. Set action: `php artisan schedule:run`
5. Set working directory: `C:\xampp\htdocs\gympro`

**Option C: Development (Testing)**
```bash
php artisan schedule:work
```

---

### Step 7: Verify Everything Works

**Checklist:**
- [ ] Migrations ran successfully
- [ ] Notification settings seeded
- [ ] Email configured (if using)
- [ ] Commands registered in Kernel
- [ ] Test subscription created → notification in DB
- [ ] Test expiring command → notifications sent
- [ ] Test expired command → subscriptions updated
- [ ] Test payment → notification sent
- [ ] Scheduler running (cron or schedule:work)

---

## 🧪 Testing Scenarios

### Scenario 1: New Subscription
```
1. Admin creates subscription
2. Check notifications table for 'subscription_created'
3. Check user's email (if email enabled)
4. Check user's in-app notifications
```

### Scenario 2: Expiring Subscription
```
1. Create subscription ending in 5 days
2. Run: php artisan subscriptions:notify-expiring --days=7
3. Check notifications table for 'subscription_expiring'
4. Check user's email
5. Check user's in-app notifications
```

### Scenario 3: Expired Subscription
```
1. Create subscription with end_date = yesterday
2. Run: php artisan subscriptions:update-expired
3. Check subscription status changed to 'expired'
4. Check notifications table for 'subscription_expired'
5. Check user's email
6. Check user's in-app notifications
```

### Scenario 4: Payment Received
```
1. Create subscription
2. Record payment with status='completed'
3. Check notifications table for 'payment_received'
4. Check user's email
5. Check user's in-app notifications
6. Check subscription auto-activated (if pending)
```

---

## 🔍 Troubleshooting

### Issue: Notifications not appearing in database

**Check 1: User has email/phone**
```bash
php artisan tinker
>>> $user = App\Models\User::find(1);
>>> $user->email;
>>> $user->phone;
```

**Check 2: Notification settings enabled**
```bash
php artisan tinker
>>> DB::table('notification_settings')->where('user_id', 1)->get();
```

**Check 3: Check logs**
```bash
tail -f storage/logs/laravel.log
```

---

### Issue: Email not sending

**Check 1: Mail config**
```bash
php artisan tinker
>>> config('mail.mailer');
>>> config('mail.from');
```

**Check 2: Test mail**
```bash
php artisan tinker
>>> Mail::raw('Test', function($m) { $m->to('test@test.com'); });
```

**Check 3: Check logs**
```bash
tail -f storage/logs/laravel.log | grep -i mail
```

---

### Issue: Commands not running

**Check 1: Commands registered**
```bash
php artisan list | grep subscriptions
```

**Check 2: Scheduler running**
```bash
ps aux | grep schedule:run
```

**Check 3: Cron logs**
```bash
grep CRON /var/log/syslog
```

---

## 📊 Monitoring

### Check Notification Count
```bash
php artisan tinker
>>> DB::table('notifications')->count();
>>> DB::table('notifications')->where('type', 'subscription_created')->count();
>>> DB::table('notifications')->where('type', 'subscription_expiring')->count();
>>> DB::table('notifications')->where('type', 'subscription_expired')->count();
>>> DB::table('notifications')->where('type', 'payment_received')->count();
```

### Check Unread Notifications
```bash
php artisan tinker
>>> DB::table('notifications')->whereNull('read_at')->count();
```

### Check User Preferences
```bash
php artisan tinker
>>> DB::table('notification_settings')->where('user_id', 1)->get();
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] All migrations tested locally
- [ ] Email configured and tested
- [ ] Commands tested manually
- [ ] Scheduler configured
- [ ] Logs monitored
- [ ] Database backed up

### Deployment Steps
```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --no-dev

# 3. Run migrations
php artisan migrate --force

# 4. Seed notification settings (if new users)
php artisan db:seed --class=NotificationSettingSeeder

# 5. Clear cache
php artisan cache:clear
php artisan config:cache

# 6. Verify scheduler
php artisan schedule:list

# 7. Monitor logs
tail -f storage/logs/laravel.log
```

---

## 📞 Support

### Documentation Files
- `NOTIFICATION_SYSTEM.md` - Architecture
- `SUBSCRIPTION_NOTIFICATIONS_INTEGRATION.md` - Integration guide
- `SUBSCRIPTION_NOTIFICATIONS_QUICK_REFERENCE.md` - Code reference

### Common Commands
```bash
# Test notifications
php artisan subscriptions:notify-expiring --days=7
php artisan subscriptions:update-expired

# Check scheduler
php artisan schedule:list
php artisan schedule:work

# Debug
php artisan tinker
php artisan tail
```

---

## ✅ Final Checklist

- [ ] Migrations run
- [ ] Seeder executed
- [ ] Email configured
- [ ] Commands registered
- [ ] Tests passed
- [ ] Scheduler running
- [ ] Logs monitored
- [ ] Documentation reviewed
- [ ] Ready for production

---

## 🎉 You're All Set!

Your subscription notification system is ready to use. Follow the steps above and you'll have:

✅ Automatic subscription created notifications
✅ Scheduled expiring subscription notifications
✅ Automatic expired subscription notifications
✅ Automatic payment received notifications
✅ Multi-channel support (Email, Push, SMS, WhatsApp)
✅ User preference management
✅ Easy to extend with new channels

**Questions?** Check the documentation or review the code examples.

**Ready to deploy?** Follow the production deployment steps above.

**Need help?** Check the troubleshooting section or review the logs.

---

## 📈 Next Phase (Future)

When ready, integrate:
- [ ] SMS notifications (Twilio)
- [ ] WhatsApp notifications (WhatsApp Business API)
- [ ] Telegram notifications
- [ ] Slack notifications
- [ ] Push notifications (Firebase)
- [ ] More events (attendance, trainer assignment, etc.)

Each integration follows the same pattern - create a new channel class and register it!
