<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_payments'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_payments'),
            'DELETE' => $this->user()->hasPermission('delete_payments'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'subscription_id' => ['required', 'integer', 'exists:subscriptions,id'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
            'payment_method' => ['required', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'phonepe'])],
            'payment_source' => ['required', Rule::in(['admin', 'gateway'])],
            'payment_type' => ['required', Rule::in(['plan', 'admission'])],
            'payment_date' => ['required', 'date', 'before_or_equal:today'],
            'status' => ['required', Rule::in(['pending', 'completed', 'failed', 'refunded'])],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'subscription_id.required' => 'Please select a subscription.',
            'subscription_id.exists' => 'Selected subscription does not exist.',
            'amount.required' => 'Payment amount is required.',
            'amount.min' => 'Payment amount must be at least 0.01.',
            'payment_method.required' => 'Payment method is required.',
            'payment_date.before_or_equal' => 'Payment date cannot be in the future.',
        ];
    }
    
    /**
     * Prevent modifying completed payments
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                $payment = $this->route('payment');
                
                if ($payment && $payment->status === 'completed' && $this->input('status') !== 'completed') {
                    $validator->errors()->add('status', 'Cannot modify a completed payment. Please create a refund instead.');
                }
                
                // Prevent deleting completed payments
                if ($this->isMethod('DELETE') && $payment->status === 'completed') {
                    $validator->errors()->add('payment', 'Cannot delete a completed payment.');
                }
            }
        });
    }
}
