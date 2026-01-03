<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'status' => 'nullable|string',
        ]);

        $search = $validated['search'] ?? null;
        $perPage = $validated['per_page'] ?? 10;
        $status = $validated['status'] ?? null;

        $query = Payment::with(['subscription.member.user', 'subscription.plan'])
            ->when($search, function ($q) use ($search) {
                $sanitized = htmlspecialchars($search, ENT_QUOTES, 'UTF-8');
                $q->where('invoice_number', 'like', "%{$sanitized}%")
                  ->orWhere('transaction_id', 'like', "%{$sanitized}%")
                  ->orWhereHas('subscription.member.user', function ($query) use ($sanitized) {
                      $query->where('name', 'like', "%{$sanitized}%");
                  });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->latest();

        $stats = [
            'total' => Payment::count(),
            'completed' => Payment::where('status', 'completed')->count(),
            'pending' => Payment::where('status', 'pending')->count(),
            'total_amount' => Payment::where('status', 'completed')->sum('amount'),
        ];

        return Inertia::render('payments/Index', [
            'payments' => $query->paginate($perPage)->withQueryString(),
            'subscriptions' => fn() => Subscription::with(['member.user', 'plan'])
                ->where('status', '!=', 'cancelled')
                ->get(),
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:plan,admission,renewal',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,completed,failed',
            'notes' => 'nullable|string',
        ]);

        $validated['payment_source'] = 'manual';
        $payment = Payment::create($validated);

        // Create notification
        if ($payment->status === 'completed') {
            NotificationService::create([
                'type' => 'payment_received',
                'title' => 'Payment Received',
                'message' => "Payment of ₹{$payment->amount} received for {$payment->subscription->member->user->name}",
                'data' => ['payment_id' => $payment->id],
                'user_id' => $payment->subscription->member->user_id,
                'priority' => 'normal',
                'color' => '#10b981',
            ]);
        }

        return redirect()->back()->with('success', 'Payment recorded successfully');
    }

    public function update(Request $request, Payment $payment)
    {
        if (!auth()->user()->hasPermission('edit_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:plan,admission,renewal',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,completed,failed,refunded',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->back()->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        if (!auth()->user()->hasPermission('delete_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $payment->delete();
        return redirect()->back()->with('success', 'Payment deleted successfully');
    }

    public function invoice(Payment $payment)
    {
        $payment->load(['subscription.member.user', 'subscription.plan']);

        $pdf = Pdf::loadView('invoices.payment', compact('payment'));
        return $pdf->download('invoice-' . $payment->invoice_number . '.pdf');
    }
}