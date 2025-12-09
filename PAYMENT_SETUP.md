# Payment Gateway Setup Guide

## PhonePe Integration

### 1. Environment Configuration

Add these to your `.env` file:

```env
PHONEPE_CLIENT_ID=your_client_id
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENVIRONMENT=UAT
PHONEPE_CALLBACK_USERNAME=your_callback_username
PHONEPE_CALLBACK_PASSWORD=your_callback_password
```

### 2. Get PhonePe Credentials

**UAT (Testing):**
- Client ID: `PGTESTPAYUAT77`
- Client Secret: Provided by PhonePe
- Environment: `UAT`
- API URL: `https://api-preprod.phonepe.com/apis/hermes`

**Production:**
- Register at: https://business.phonepe.com/
- Complete KYC verification
- Get production credentials
- Environment: `PRODUCTION`

### 3. Install PhonePe SDK

```bash
composer require phonepe/phonepe-pg-php-sdk
```

### 4. Test Payment Flow

1. **Member logs in** → Goes to `/member/plans`
2. **Selects plan** → Clicks "Buy Now"
3. **Reviews order** → `/member/checkout/{plan_id}`
4. **Clicks "Proceed to Payment"** → Redirects to PhonePe
5. **Completes payment** → PhonePe redirects back
6. **Callback verification** → Creates subscription & payment record
7. **Success redirect** → `/member/dashboard`

### 5. Callback URL Setup

In PhonePe dashboard, set callback URL:
```
https://yourdomain.com/member/payment/callback
```

For local testing:
```
http://127.0.0.1:8000/member/payment/callback
```

### 6. Testing

**Test Cards (UAT):**
- Success: Any card with CVV 123
- Failure: Any card with CVV 000

**Test UPI:**
- Success: `success@ybl`
- Failure: `failure@ybl`

### 7. Features Implemented

✅ Plans page with monthly/yearly tabs
✅ Active plan highlighting
✅ Checkout page with order summary
✅ PhonePe payment gateway integration
✅ Payment callback verification
✅ Auto subscription creation
✅ Auto payment record with invoice
✅ Admission fee waiver for existing members
✅ Member sidebar "Buy Plans" menu

### 8. Database Tables Used

- `plans` - Membership plans
- `subscriptions` - Member subscriptions
- `payments` - Payment records with invoices
- `members` - Member details

### 9. Routes

```php
GET  /member/plans                    - View all plans
GET  /member/checkout/{plan}          - Checkout page
POST /member/payment/initiate         - Start payment
ANY  /member/payment/callback         - Payment callback
```

### 10. Troubleshooting

**Error: "Undefined array key 'context'"**
- Check PhonePe credentials in `.env`
- Verify `config/services.php` exists
- Run: `php artisan config:clear`

**Payment not completing:**
- Check callback URL is accessible
- Verify transaction ID in session
- Check PhonePe dashboard for transaction status

**Subscription not created:**
- Check payment callback is being called
- Verify session data exists
- Check database for errors

### 11. Production Checklist

- [ ] Get production PhonePe credentials
- [ ] Update `.env` with production values
- [ ] Set `PHONEPE_ENVIRONMENT=PRODUCTION`
- [ ] Configure production callback URL
- [ ] Test with real payment methods
- [ ] Enable SSL certificate
- [ ] Set up webhook monitoring
- [ ] Configure payment failure notifications

### 12. Security Notes

- Never commit `.env` file
- Keep client secret secure
- Validate all callbacks
- Use HTTPS in production
- Implement rate limiting
- Log all transactions
- Monitor for fraud

---

## Next Steps

To add more payment gateways (Razorpay, Stripe, etc.):

1. Create service class in `app/Services/`
2. Add credentials to `config/services.php`
3. Update `MemberPlanController` with new gateway logic
4. Add gateway selection in Checkout page
5. Implement callback verification

---

Ready to accept payments! 🚀
