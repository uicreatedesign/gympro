# Payment Flow Debug Guide

## Steps to Debug Payment Issue

1. **Check Laravel Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Test Payment Flow Manually**
   - Login as member
   - Go to /member/plans
   - Click on a plan
   - Click "Proceed to Payment"
   - Complete PhonePe payment
   - Check logs for:
     - "Payment callback received"
     - "Pending subscription from session"
     - "Payment verification result"
     - "Payment created, triggering activation"
     - "Checking subscription activation"
     - "Subscription activated"

3. **Common Issues**

   **Issue 1: Session Lost**
   - Session data cleared before callback
   - Solution: Check session driver in .env (use 'database' or 'redis')

   **Issue 2: Payment Verification Fails**
   - PhonePe credentials incorrect
   - Solution: Check PHONEPE_* variables in .env

   **Issue 3: Subscription Not Activating**
   - Payment observer not firing
   - Solution: Check logs for "Payment created, triggering activation"

4. **Manual Test via Tinker**
   ```php
   php artisan tinker
   
   $member = App\Models\Member::first();
   $plan = App\Models\Plan::first();
   
   $data = [
       'member_id' => $member->id,
       'plan_id' => $plan->id,
       'amount' => $plan->price,
       'admission_fee' => 0,
       'transaction_id' => 'TEST_' . time()
   ];
   
   $sub = App\Models\Subscription::create([
       'member_id' => $data['member_id'],
       'plan_id' => $data['plan_id'],
       'start_date' => now(),
       'end_date' => now()->addMonths($plan->duration_months),
       'status' => 'pending',
   ]);
   
   $payment = App\Models\Payment::create([
       'subscription_id' => $sub->id,
       'amount' => $data['amount'],
       'payment_date' => now(),
       'payment_method' => 'phonepe',
       'payment_source' => 'gateway',
       'payment_type' => 'plan',
       'transaction_id' => $data['transaction_id'],
       'status' => 'completed',
   ]);
   
   $sub->refresh();
   echo "Status: " . $sub->status . "\n";
   echo "Payment Status: " . $sub->payment_status . "\n";
   ```

5. **Check Database**
   ```sql
   SELECT * FROM subscriptions WHERE member_id = X ORDER BY created_at DESC LIMIT 1;
   SELECT * FROM payments WHERE subscription_id = Y;
   ```

## Files Modified with Logging
- app/Http/Controllers/MemberPlanController.php
- app/Models/Payment.php
- app/Models/Subscription.php

All payment flow steps now have logging enabled.
