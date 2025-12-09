<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Member;
use App\Models\Subscription;
use App\Models\Payment;
use App\Services\PhonePeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MemberPlanController extends Controller
{
    public function index()
    {
        $member = Member::where('user_id', auth()->id())->first();
        
        $plans = Plan::where('status', 'active')->get();
        
        $activeSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with('plan')
            ->first();
        
        return Inertia::render('member/Plans', [
            'plans' => $plans,
            'activeSubscription' => $activeSubscription,
            'member' => $member,
        ]);
    }

    public function checkout($planId)
    {
        $member = Member::where('user_id', auth()->id())->first();
        $plan = Plan::findOrFail($planId);
        
        $activeSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->first();
        
        return Inertia::render('member/Checkout', [
            'plan' => $plan,
            'member' => $member,
            'hasActiveSubscription' => $activeSubscription ? true : false,
        ]);
    }

    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'gateway' => 'required|in:phonepe',
        ]);

        $member = Member::where('user_id', auth()->id())->first();
        $plan = Plan::findOrFail($validated['plan_id']);

        $activeSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->first();

        $admissionFee = $activeSubscription ? 0 : $plan->admission_fee;
        $totalAmount = $plan->price + $admissionFee;

        $transactionId = 'TXN' . time() . rand(1000, 9999);

        session([
            'pending_subscription' => [
                'member_id' => $member->id,
                'plan_id' => $plan->id,
                'amount' => $plan->price,
                'admission_fee' => $admissionFee,
                'total_amount' => $totalAmount,
                'transaction_id' => $transactionId,
            ]
        ]);

        return $this->initiatePhonePe($transactionId, $totalAmount, $member);
    }

    private function initiatePhonePe($transactionId, $amount, $member)
    {
        $phonePeService = new PhonePeService();
        $redirectUrl = route('member.payment.callback');
        
        $result = $phonePeService->initiatePayment($transactionId, $amount * 100, $redirectUrl);
        
        if ($result['success']) {
            return Inertia::render('member/PaymentRedirect', [
                'redirectUrl' => $result['redirect_url']
            ]);
        }
        
        return redirect()->back()->withErrors(['error' => $result['error'] ?? 'Payment initiation failed']);
    }



    public function simulatePayment(Request $request)
    {
        $orderId = $request->query('orderId');
        $amount = $request->query('amount');
        
        return Inertia::render('member/PaymentSimulator', [
            'orderId' => $orderId,
            'amount' => $amount / 100,
            'callbackUrl' => route('member.payment.callback')
        ]);
    }

    public function paymentCallback(Request $request)
    {
        if (!auth()->check()) {
            $pendingSubscription = session('pending_subscription');
            if ($pendingSubscription) {
                session()->put('payment_pending', true);
            }
            return redirect('/login')->with('message', 'Please login to complete your payment');
        }

        $pendingSubscription = session('pending_subscription');

        if (!$pendingSubscription) {
            return redirect('/member/plans')->with('error', 'Invalid payment session');
        }

        $transactionId = $pendingSubscription['transaction_id'];
        $verified = $this->verifyPhonePePayment($transactionId);
        
        if ($verified) {
            $this->createSubscriptionAndPayment($pendingSubscription, 'phonepe', $transactionId);
            session()->forget('pending_subscription');
            return redirect('/member/dashboard')->with('success', 'Payment successful! Your subscription is now active.');
        }

        return redirect('/member/plans')->with('error', 'Payment verification failed');
    }

    private function verifyPhonePePayment($transactionId)
    {
        $phonePeService = new PhonePeService();
        $result = $phonePeService->checkOrderStatus($transactionId);
        
        return $result['success'] && $result['state'] === 'COMPLETED';
    }



    private function createSubscriptionAndPayment($data, $gateway, $transactionId)
    {
        $member = Member::find($data['member_id']);
        $plan = Plan::find($data['plan_id']);

        $startDate = now();
        $endDate = now()->addMonths($plan->duration_months);

        $subscription = Subscription::create([
            'member_id' => $data['member_id'],
            'plan_id' => $data['plan_id'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'amount_paid' => $data['amount'],
            'admission_fee_paid' => $data['admission_fee'],
            'payment_status' => 'paid',
            'status' => 'active',
        ]);

        Payment::create([
            'member_id' => $data['member_id'],
            'subscription_id' => $subscription->id,
            'amount' => $data['total_amount'],
            'payment_date' => now(),
            'payment_method' => $gateway,
            'transaction_id' => $transactionId,
            'status' => 'completed',
        ]);
    }
}
