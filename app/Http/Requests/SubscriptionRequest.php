<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_subscriptions'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_subscriptions'),
            'DELETE' => $this->user()->hasPermission('delete_subscriptions'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'member_id' => ['required', 'integer', 'exists:members,id'],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
            'trainer_id' => ['nullable', 'integer', 'exists:trainers,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'status' => ['required', Rule::in(['active', 'expired', 'cancelled', 'pending'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            
            // Optional payment fields
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['nullable', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'phonepe'])],
            'payment_type' => ['nullable', Rule::in(['plan', 'admission'])],
            'payment_date' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'Selected member does not exist.',
            'plan_id.required' => 'Please select a plan.',
            'plan_id.exists' => 'Selected plan does not exist.',
            'trainer_id.exists' => 'Selected trainer does not exist.',
            'end_date.after' => 'End date must be after start date.',
        ];
    }
    
    /**
     * Configure validation for update scenarios
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Prevent changing subscription to active if overlapping exists
            if ($this->isMethod('POST') || ($this->isMethod('PUT') && $this->input('status') === 'active')) {
                $this->checkOverlappingSubscriptions($validator);
            }
        });
    }
    
    protected function checkOverlappingSubscriptions($validator): void
    {
        $memberId = $this->input('member_id');
        $startDate = $this->input('start_date');
        $endDate = $this->input('end_date');
        $currentId = $this->route('subscription')?->id;
        
        $overlapping = \App\Models\Subscription::where('member_id', $memberId)
            ->where('status', 'active')
            ->when($currentId, fn($q) => $q->where('id', '!=', $currentId))
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                          ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();
            
        if ($overlapping) {
            $validator->errors()->add('member_id', 'Member already has an active subscription during this period.');
        }
    }
}
