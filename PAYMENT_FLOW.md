# Payment Management Flow - Restructured

## 🎯 New Architecture

### **Single Source of Truth**
```
Member → Subscription → Payments (1-to-many)
```

## 📊 Database Structure

### **Subscriptions Table**
```sql
- id
- member_id (FK to members)
- plan_id (FK to plans)
- start_date
- end_date
- status (pending, active, expired, cancelled)
- notes
```

**Removed Fields**: `amount_paid`, `admission_fee_paid`, `payment_status` (now computed)

### **Payments Table**
```sql
- id
- subscription_id (FK to subscriptions) - REQUIRED
- invoice_number (auto-generated)
- amount
- payment_method (cash, card, upi, bank_transfer)
- payment_source (manual, gateway) - NEW
- payment_type (plan, admission, renewal) - UPDATED
- payment_date
- status (pending, completed, failed, refunded)
- transaction_id
- notes
```

**Removed Fields**: `member_id` (get via subscription relationship)

---

## 🔄 Payment Flow

### **1. Manual Payment Entry**

**Scenario A: Create Subscription with Payment**
```php
// Step 1: Create subscription
$subscription = Subscription::create([
    'member_id' => $memberId,
    'plan_id' => $planId,
    'start_date' => now(),
    'status' => 'pending'
]);

// Step 2: Record payment (auto-created if payment_amount provided)
$payment = $subscription->payments()->create([
    'amount' => $plan->price,
    'payment_method' => 'cash',
    'payment_source' => 'manual',
    'payment_type' => 'plan',
    'payment_date' => now(),
    'status' => 'completed'
]);

// Step 3: Auto-activation (handled by Payment model observer)
// Subscription status changes to 'active' when fully paid
```

**Scenario B: Record Payment Later**
```php
// From Payments module
Payment::create([
    'subscription_id' => $subscriptionId,
    'amount' => 500,
    'payment_method' => 'upi',
    'payment_source' => 'manual',
    'payment_type' => 'plan',
    'payment_date' => now(),
    'status' => 'completed'
]);
```

### **2. Payment Gateway (PhonePe)**

```php
// Member portal checkout
$payment = $subscription->payments()->create([
    'amount' => $plan->price,
    'payment_method' => 'upi',
    'payment_source' => 'gateway',
    'payment_type' => 'plan',
    'payment_date' => now(),
    'status' => 'pending',
    'transaction_id' => $phonePeTransactionId
]);

// On callback success
$payment->update(['status' => 'completed']);
// Auto-activates subscription via observer
```

---

## 🧮 Computed Attributes

### **Subscription Model**

```php
// Total amount paid
$subscription->total_paid; // Sum of completed payments

// Payment status (auto-computed)
$subscription->payment_status; 
// Returns: 'paid', 'partial', 'pending', 'overdue'

// Check if fully paid
if ($subscription->payment_status === 'paid') {
    // Subscription is fully paid
}
```

---

## ✅ Benefits

1. **No Data Duplication**: Payment info stored once in payments table
2. **Automatic Status Updates**: Subscription activates when fully paid
3. **Payment History**: Track all payments per subscription
4. **Installment Support**: Multiple payments for one subscription
5. **Gateway Integration**: Seamless PhonePe integration
6. **Audit Trail**: Complete payment history with source tracking

---

## 🔧 Key Features

### **Auto-Activation**
```php
// Payment model observer
static::created(function ($payment) {
    if ($payment->status === 'completed') {
        $payment->subscription->checkAndActivate();
    }
});
```

### **Payment Status Logic**
```php
public function getPaymentStatusAttribute() {
    $totalPaid = $this->total_paid;
    $totalRequired = $this->plan->price + $this->plan->admission_fee;
    
    if ($totalPaid >= $totalRequired) return 'paid';
    if ($totalPaid > 0) return 'partial';
    if ($this->end_date < now()) return 'overdue';
    return 'pending';
}
```

---

## 📱 User Workflows

### **Admin: Create Subscription**
1. Go to Subscriptions → Add Subscription
2. Select member and plan
3. Optionally enter payment details
4. Submit → Subscription created + Payment recorded (if provided)
5. Status auto-updates to 'active' if fully paid

### **Admin: Record Payment**
1. Go to Payments → Record Payment
2. Select subscription
3. Enter amount and payment method
4. Submit → Payment recorded
5. Subscription auto-activates if fully paid

### **Member: Purchase Plan**
1. Browse plans in member portal
2. Click "Purchase"
3. Choose payment method (PhonePe)
4. Complete payment
5. Subscription auto-created and activated

---

## 🎨 UI Changes Needed

### **Subscription Form**
- Remove: `amount_paid`, `admission_fee_paid`, `payment_status` fields
- Add: Optional payment section (collapsible)
  - Payment amount
  - Payment method
  - Payment date

### **Subscription Table**
- Show computed `payment_status` badge
- Show `total_paid` amount
- Add "Record Payment" button per row

### **Payment Form**
- Remove: `member_id` field
- Change: `subscription_id` (required dropdown)
- Add: `payment_source` (auto-set based on context)
- Update: `payment_type` options (plan, admission, renewal)

---

## 🚀 Migration Applied

✅ Removed payment fields from subscriptions table
✅ Removed member_id from payments table
✅ Added payment_source column
✅ Updated payment_type enum values
✅ Made subscription_id required with cascade delete

---

## 📝 Next Steps

1. Update frontend forms (Subscription & Payment)
2. Update table displays to show computed values
3. Test manual payment entry
4. Test payment gateway flow
5. Update invoice template
6. Add payment history view in subscription details

