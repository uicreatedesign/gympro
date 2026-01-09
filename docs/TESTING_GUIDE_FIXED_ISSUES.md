# 🧪 Testing Guide - Fixed Issues

## Test 1: Member Role Assignment ✅

### Scenario: New User Registration via Google

**Steps:**
1. Go to login page
2. Click "Login with Google"
3. Complete Google authentication
4. User redirected to dashboard

**Verify:**
```bash
php artisan tinker
>>> $user = App\Models\User::latest()->first();
>>> $user->roles()->pluck('name');
// Output: ["Member"]

>>> $member = App\Models\Member::where('user_id', $user->id)->first();
>>> $member->status;
// Output: "active"
```

**Expected Result:**
- ✅ User has "Member" role
- ✅ Member profile created with status "active"
- ✅ User can access member dashboard

---

## Test 2: Plan Purchase Notifications ✅

### Scenario A: PhonePe Payment

**Steps:**
1. Login as member
2. Go to Plans page
3. Click "Buy Plan"
4. Complete PhonePe payment
5. Return to dashboard

**Verify Notifications:**
```bash
php artisan tinker

# Check member notification
>>> DB::table('notifications')
    ->where('type', 'subscription_purchased')
    ->where('user_id', $memberId)
    ->latest()
    ->first();

# Check admin notifications
>>> DB::table('notifications')
    ->where('type', 'subscription_purchased')
    ->where('user_id', $adminId)
    ->latest()
    ->first();
```

**Expected Result:**
- ✅ Notification in DB for member
- ✅ Notification in DB for all admins
- ✅ Email sent to member
- ✅ Email sent to admins
- ✅ In-app notification visible

---

### Scenario B: Manual Payment (Admin)

**Steps:**
1. Login as admin
2. Go to Payments
3. Click "Add Payment"
4. Fill form with status="completed"
5. Submit

**Verify:**
```bash
php artisan tinker

# Check notifications created
>>> DB::table('notifications')
    ->where('type', 'subscription_purchased')
    ->latest()
    ->limit(5)
    ->get();
```

**Expected Result:**
- ✅ Notification sent to member
- ✅ Notification sent to all admins
- ✅ Email sent to both

---

## Test 3: Email Delivery ✅

### Setup Mailtrap (for testing)

1. Go to https://mailtrap.io
2. Create free account
3. Get SMTP credentials
4. Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@gympro.local
MAIL_FROM_NAME="Gympro"
```

### Test Email Sending

```bash
php artisan tinker
>>> Mail::raw('Test email', function($m) { 
    $m->to('test@example.com'); 
});
// Should show: true
```

### Check Mailtrap Inbox
- Go to Mailtrap inbox
- Should see test email
- Should see purchase notification emails

---

## Test 4: Notification Preferences ✅

### User Preferences

**Steps:**
1. Login as member
2. Go to Settings > Notifications
3. Toggle Email on/off
4. Toggle Push on/off
5. Save

**Verify:**
```bash
php artisan tinker
>>> DB::table('notification_settings')
    ->where('user_id', $userId)
    ->get();
// Should show: email, push, sms, whatsapp with enabled status
```

**Expected Result:**
- ✅ User can enable/disable channels
- ✅ Preferences saved in DB
- ✅ Notifications respect preferences

---

## Test 5: Admin Notifications ✅

### Admin Dashboard

**Steps:**
1. Login as admin
2. Check notification bell icon
3. Should show recent notifications
4. Click to view details

**Verify:**
```bash
php artisan tinker
>>> DB::table('notifications')
    ->where('user_id', $adminId)
    ->where('read_at', null)
    ->count();
// Should show unread count
```

**Expected Result:**
- ✅ Admin sees purchase notifications
- ✅ Can mark as read
- ✅ Can delete notifications

---

## Test 6: Member Notifications ✅

### Member Dashboard

**Steps:**
1. Login as member
2. Check notification bell icon
3. Should show purchase notification
4. Click to view details

**Verify:**
```bash
php artisan tinker
>>> DB::table('notifications')
    ->where('user_id', $memberId)
    ->where('type', 'subscription_purchased')
    ->first();
```

**Expected Result:**
- ✅ Member sees purchase notification
- ✅ Shows plan name and amount
- ✅ Can mark as read

---

## Troubleshooting

### Issue: No notifications in DB

**Check:**
```bash
# 1. Check notification settings enabled
php artisan tinker
>>> DB::table('notification_settings')->where('user_id', $userId)->get();

# 2. Check user has email
>>> $user = App\Models\User::find($userId);
>>> $user->email;

# 3. Check logs
tail -f storage/logs/laravel.log | grep -i notification
```

### Issue: Email not sending

**Check:**
```bash
# 1. Test mail config
php artisan tinker
>>> Mail::raw('Test', function($m) { $m->to('test@test.com'); });

# 2. Check .env settings
>>> config('mail.mailer');
>>> config('mail.from');

# 3. Check logs
tail -f storage/logs/laravel.log | grep -i mail
```

### Issue: Member role not assigned

**Check:**
```bash
php artisan tinker
>>> $user = App\Models\User::latest()->first();
>>> $user->roles()->pluck('name');

# If empty, manually assign:
>>> $role = App\Models\Role::where('name', 'Member')->first();
>>> $user->roles()->attach($role->id);
```

---

## Quick Test Commands

```bash
# Test member registration
php artisan tinker
>>> $user = App\Models\User::create([
    'name' => 'Test Member',
    'email' => 'member@test.com',
    'password' => bcrypt('password'),
    'email_verified_at' => now()
]);
>>> $role = App\Models\Role::where('name', 'Member')->first();
>>> $user->roles()->attach($role->id);
>>> App\Models\Member::create(['user_id' => $user->id, 'status' => 'active']);

# Test payment notification
>>> $subscription = App\Models\Subscription::first();
>>> $payment = App\Models\Payment::create([
    'subscription_id' => $subscription->id,
    'amount' => 5000,
    'payment_method' => 'cash',
    'payment_type' => 'plan',
    'payment_date' => now(),
    'status' => 'completed'
]);

# Check notifications
>>> DB::table('notifications')->where('type', 'subscription_purchased')->latest()->get();
```

---

## Checklist

- [ ] Email configured in .env
- [ ] Test member registration
- [ ] Test plan purchase
- [ ] Check member notification
- [ ] Check admin notification
- [ ] Check email delivery
- [ ] Test notification preferences
- [ ] Test marking as read
- [ ] Test deleting notification
- [ ] Monitor logs for errors

---

## Status: ✅ READY FOR TESTING

All fixes implemented and ready to test!
