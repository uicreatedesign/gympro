<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['member', 'subscription.plan'])
            ->latest()
            ->paginate(50);

        return Inertia::render('payments/Index', [
            'payments' => $payments,
            'members' => fn() => Member::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:subscription,renewal,other',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,completed,failed',
            'notes' => 'nullable|string',
        ]);

        Payment::create($validated);

        return redirect()->back()->with('success', 'Payment created successfully');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'subscription_id' => 'nullable|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
            'payment_type' => 'required|in:subscription,renewal,other',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,completed,failed',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        return redirect()->back()->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->back()->with('success', 'Payment deleted successfully');
    }

    public function invoice(Payment $payment)
    {
        $payment->load(['member', 'subscription.plan']);

        $pdf = Pdf::loadView('invoices.payment', compact('payment'));
        return $pdf->download('invoice-' . $payment->invoice_number . '.pdf');
    }
}