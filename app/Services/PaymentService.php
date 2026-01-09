<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Notifications\Events\SubscriptionPurchasedEvent;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Get paginated payments with filtering
     */
    public function getPayments(array $filters = []): array
    {
        $query = Payment::with(['subscription.member.user', 'subscription.plan'])
            ->when(!empty($filters['search']), function ($q) use ($filters) {
                $search = htmlspecialchars($filters['search'], ENT_QUOTES, 'UTF-8');
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('subscription.member.user', function ($query) use ($search) {
                      $query->where('name', 'like', "%{$search}%");
                  });
            })
            ->when(!empty($filters['status']), function ($q) use ($filters) {
                $q->where('status', $filters['status']);
            });

        $perPage = $filters['per_page'] ?? 10;
        $payments = $query->latest()->paginate($perPage);

        $stats = [
            'total' => Payment::count(),
            'completed' => Payment::where('status', 'completed')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'failed' => Payment::where('status', 'failed')->count(),
            'refunded' => Payment::where('status', 'refunded')->count(),
            'total_amount' => Payment::where('status', 'completed')->sum('amount'),
        ];

        return [
            'payments' => $payments,
            'stats' => $stats,
        ];
    }

    /**
     * Create a new payment
     */
    public function createPayment(array $data): Payment
    {
        $data['payment_source'] = $data['payment_source'] ?? 'manual';

        $payment = Payment::create($data);

        if ($payment->status === 'completed') {
            $subscription = $payment->subscription->load('member.user', 'plan');
            $member = $subscription->member;
            $plan = $subscription->plan;

            // Notify member
            $memberEvent = new SubscriptionPurchasedEvent($member->user, [
                'subscription_id' => $subscription->id,
                'payment_id' => $payment->id,
                'plan_name' => $plan->name,
                'member_name' => $member->user->name,
                'amount' => $payment->amount,
            ]);
            $this->notificationService->dispatchEvent($memberEvent);

            // Notify admins
            $admins = User::whereHas('roles', function($q) {
                $q->whereIn('name', ['Admin', 'Manager']);
            })->get();
            
            foreach ($admins as $admin) {
                $adminEvent = new SubscriptionPurchasedEvent($admin, [
                    'subscription_id' => $subscription->id,
                    'payment_id' => $payment->id,
                    'plan_name' => $plan->name,
                    'member_name' => $member->user->name,
                    'amount' => $payment->amount,
                ]);
                $this->notificationService->dispatchEvent($adminEvent);
            }
        }

        return $payment->fresh(['subscription.member.user', 'subscription.plan']);
    }

    /**
     * Update payment
     */
    public function updatePayment(Payment $payment, array $data): Payment
    {
        $oldStatus = $payment->status;
        $payment->update($data);

        // Create notification if status changed to completed
        if ($oldStatus !== 'completed' && $payment->status === 'completed') {
            $this->notificationService->create([
                'type' => 'payment_completed',
                'title' => 'Payment Completed',
                'message' => "Payment of ₹{$payment->amount} has been marked as completed",
                'data' => ['payment_id' => $payment->id],
                'user_id' => $payment->subscription->member->user_id,
                'priority' => 'normal',
                'color' => '#10b981',
            ]);
        }

        return $payment->fresh(['subscription.member.user', 'subscription.plan']);
    }

    /**
     * Delete payment
     */
    public function deletePayment(Payment $payment): bool
    {
        return $payment->delete();
    }

    /**
     * Generate and download invoice PDF
     */
    public function generateInvoice(Payment $payment): \Illuminate\Http\Response
    {
        $payment->load(['subscription.member.user', 'subscription.plan']);

        $pdf = Pdf::loadView('invoices.payment', compact('payment'));
        return $pdf->download('invoice-' . $payment->invoice_number . '.pdf');
    }

    /**
     * Get payment by ID with relationships
     */
    public function getPaymentById(int $id): Payment
    {
        return Payment::with(['subscription.member.user', 'subscription.plan'])
            ->findOrFail($id);
    }

    /**
     * Get payments for a subscription
     */
    public function getPaymentsForSubscription(int $subscriptionId): Collection
    {
        return Payment::where('subscription_id', $subscriptionId)
            ->orderBy('payment_date', 'desc')
            ->get();
    }

    /**
     * Get total payments by method within date range
     */
    public function getPaymentSummaryByMethod(string $startDate, string $endDate): Collection
    {
        return Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();
    }

    /**
     * Get total payments by type within date range
     */
    public function getPaymentSummaryByType(string $startDate, string $endDate): Collection
    {
        return Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('payment_type, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('payment_type')
            ->get();
    }

    /**
     * Get daily payment totals within date range
     */
    public function getDailyPaymentTotals(string $startDate, string $endDate): Collection
    {
        return Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('DATE(payment_date) as date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Process PhonePe payment callback
     */
    public function processPhonePeCallback(array $callbackData): array
    {
        // Implementation for PhonePe payment processing
        // This would handle webhook callbacks from PhonePe

        $orderId = $callbackData['data']['merchantTransactionId'] ?? null;
        $status = $callbackData['data']['responseCode'] ?? null;

        if (!$orderId) {
            return ['success' => false, 'message' => 'Invalid callback data'];
        }

        // Find payment by transaction ID
        $payment = Payment::where('transaction_id', $orderId)->first();

        if (!$payment) {
            return ['success' => false, 'message' => 'Payment not found'];
        }

        // Update payment status based on PhonePe response
        if ($status === 'SUCCESS') {
            $payment->update([
                'status' => 'completed',
                'transaction_id' => $orderId,
            ]);

            return ['success' => true, 'message' => 'Payment completed successfully'];
        } else {
            $payment->update(['status' => 'failed']);
            return ['success' => false, 'message' => 'Payment failed'];
        }
    }

    /**
     * Get validation rules for payment
     */
    public function getValidationRules(): array
    {
        return [
            'subscription_id' => 'required|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer,phonepe',
            'payment_type' => 'required|in:plan,admission,renewal',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,completed,failed,refunded',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string',
        ];
    }

    /**
     * Get lazy-loaded data for payment forms
     */
    public function getFormData(): array
    {
        return [
            'subscriptions' => Subscription::with(['member.user', 'plan'])
                ->where('status', '!=', 'cancelled')
                ->get(),
        ];
    }
}
