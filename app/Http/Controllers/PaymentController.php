<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

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

        $filters = [
            'search' => $validated['search'] ?? null,
            'per_page' => $validated['per_page'] ?? 10,
            'status' => $validated['status'] ?? null,
        ];

        $result = $this->paymentService->getPayments($filters);
        $formData = $this->paymentService->getFormData();

        return Inertia::render('payments/Index', [
            'payments' => $result['payments'],
            'subscriptions' => $formData['subscriptions'],
            'stats' => $result['stats'],
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->paymentService->getValidationRules());
        $this->paymentService->createPayment($validated);

        return redirect()->back()->with('success', 'Payment recorded successfully');
    }

    public function update(Request $request, Payment $payment)
    {
        if (!auth()->user()->hasPermission('edit_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->paymentService->getValidationRules());
        $this->paymentService->updatePayment($payment, $validated);

        return redirect()->back()->with('success', 'Payment updated successfully');
    }

    public function destroy(Payment $payment)
    {
        if (!auth()->user()->hasPermission('delete_payments')) {
            abort(403, 'Unauthorized action.');
        }

        $this->paymentService->deletePayment($payment);
        return redirect()->back()->with('success', 'Payment deleted successfully');
    }

    public function invoice(Payment $payment)
    {
        return $this->paymentService->generateInvoice($payment);
    }
}