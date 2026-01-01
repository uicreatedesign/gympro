<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PhonePePaymentController extends Controller
{
    public function checkout($planId)
    {
        $member = Member::where('user_id', auth()->id())->with('user')->first();
        if (!$member) abort(404, 'Member profile not found');

        $plan = Plan::findOrFail($planId);
        
        $hasActiveSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->exists();

        $amount = $plan->price;
        if (!$hasActiveSubscription) {
            $amount += $plan->admission_fee;
        }

        return Inertia::render('member/Checkout', [
            'plan' => $plan,
            'member' => $member,
            'amount' => $amount,
            'hasActiveSubscription' => $hasActiveSubscription,
        ]);
    }

    public function initiatePayment(Request $request, $planId)
    {
        $phonepeEnabled = Setting::get('phonepe_enabled', '0');
        if ($phonepeEnabled !== '1') {
            return redirect()->route('member.plans.checkout', $planId)->with('error', 'Payment gateway is currently disabled');
        }

        $member = Member::where('user_id', auth()->id())->with('user')->first();
        if (!$member) abort(404);

        $plan = Plan::findOrFail($planId);
        
        $hasActiveSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->exists();

        $amount = $plan->price;
        if (!$hasActiveSubscription) {
            $amount += $plan->admission_fee;
        }

        $merchantOrderId = 'ORD' . time() . rand(1000, 9999);
        $merchantId = Setting::get('phonepe_merchant_id');
        $saltKey = Setting::get('phonepe_salt_key');
        $saltIndex = Setting::get('phonepe_salt_index', '1');
        $env = Setting::get('phonepe_env', 'UAT');

        $paymentUrl = $env === 'PRODUCTION'
            ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
            : 'https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay';

        try {
            $payload = [
                'merchantId' => $merchantId,
                'merchantTransactionId' => $merchantOrderId,
                'merchantUserId' => 'MUID' . $member->id,
                'amount' => $amount * 100,
                'redirectUrl' => route('phonepe.callback', ['orderId' => $merchantOrderId]),
                'redirectMode' => 'REDIRECT',
                'callbackUrl' => route('phonepe.callback', ['orderId' => $merchantOrderId]),
                'mobileNumber' => $member->user->phone ?? '',
                'paymentInstrument' => [
                    'type' => 'PAY_PAGE'
                ]
            ];

            $jsonPayload = json_encode($payload);
            $base64Payload = base64_encode($jsonPayload);
            $xVerify = hash('sha256', $base64Payload . '/pg/v1/pay' . $saltKey) . '###' . $saltIndex;

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-VERIFY' => $xVerify,
            ])->post($paymentUrl, [
                'request' => $base64Payload
            ]);

            \Log::info('PhonePe Payment Response', ['response' => $response->json()]);

            $data = $response->json();

            if (!$response->successful() || !($data['success'] ?? false)) {
                return redirect()->route('member.plans.checkout', $planId)->with('error', 'Failed to initiate payment: ' . ($data['message'] ?? 'Unknown error'));
            }

            $redirectUrl = $data['data']['instrumentResponse']['redirectInfo']['url'] ?? null;
            if (!$redirectUrl) {
                return redirect()->route('member.plans.checkout', $planId)->with('error', 'Payment gateway error: No redirect URL');
            }

            DB::table('pending_payments')->insert([
                'order_id' => $merchantOrderId,
                'member_id' => $member->id,
                'plan_id' => $plan->id,
                'amount' => $amount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            \Log::error('PhonePe Payment Error', ['error' => $e->getMessage()]);
            return redirect()->route('member.plans.checkout', $planId)->with('error', 'Payment error: ' . $e->getMessage());
        }
    }

    public function callback(Request $request, $orderId)
    {
        $pendingPayment = DB::table('pending_payments')->where('order_id', $orderId)->first();
        
        if (!$pendingPayment) {
            return redirect()->route('member.plans')->with('error', 'Payment not found');
        }

        $member = Member::with('user')->find($pendingPayment->member_id);
        $plan = Plan::find($pendingPayment->plan_id);

        $startDate = now();
        $endDate = now()->addMonths($plan->duration_months);

        $subscription = Subscription::create([
            'member_id' => $member->id,
            'plan_id' => $plan->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'amount' => $pendingPayment->amount,
            'admission_fee' => $plan->admission_fee,
            'payment_status' => 'paid',
            'status' => 'active',
        ]);

        Payment::create([
            'member_id' => $member->id,
            'subscription_id' => $subscription->id,
            'amount' => $pendingPayment->amount,
            'payment_method' => 'phonepe',
            'payment_type' => 'subscription',
            'payment_date' => now(),
            'transaction_id' => $orderId,
            'status' => 'completed',
        ]);

        DB::table('pending_payments')->where('order_id', $orderId)->delete();

        return redirect()->route('member.dashboard')->with('success', 'Payment successful! Your subscription is now active.');
    }
}
