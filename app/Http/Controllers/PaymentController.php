<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Member;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $payments = Payment::with(['member', 'subscription'])->latest()->get();

        return Inertia::render('payments/Index', [
            'payments' => $payments,
            'members' => Member::where('status', 'active')->get(),
            'subscriptions' => Subscription::with('member', 'plan')->where('status', 'active')->get(),
            'stats' => [
                'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'completed_today' => Payment::where('status', 'completed')->whereDate('payment_date', today())->sum('amount'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:subscription,admission,other',
            'payment_date' => 'required|date',
            'status' => 'required|in:completed,pending,failed,refunded',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string',
        ]);

        $validated['invoice_number'] = Payment::generateInvoiceNumber();

        Payment::create($validated);

        return redirect()->back()->with('success', 'Payment recorded successfully');
    }

    public function update(Request $request, Payment $payment)
    {
        if (!auth()->user()->hasPermission('edit_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:subscription,admission,other',
            'payment_date' => 'required|date',
            'status' => 'required|in:completed,pending,failed,refunded',
            'notes' => 'nullable|string',
            'transaction_id' => 'nullable|string',
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
        if (!auth()->user()->hasPermission('view_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $payment->load(['member', 'subscription.plan']);
        
        $pdf = \PDF::loadView('invoices.payment', compact('payment'));
        return $pdf->download('invoice-' . $payment->invoice_number . '.pdf');
    }
}
