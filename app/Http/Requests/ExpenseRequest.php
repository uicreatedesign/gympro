<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_expenses'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_expenses'),
            'DELETE' => $this->user()->hasPermission('delete_expenses'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:9999999.99'],
            'category' => ['required', Rule::in([
                'rent',
                'utilities',
                'equipment',
                'salaries',
                'maintenance',
                'marketing',
                'supplies',
                'insurance',
                'taxes',
                'other'
            ])],
            'expense_date' => ['required', 'date', 'before_or_equal:today'],
            'payment_method' => ['required', Rule::in(['cash', 'card', 'bank_transfer', 'cheque'])],
            'receipt' => ['nullable', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'], // 5MB
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Expense title is required.',
            'amount.required' => 'Expense amount is required.',
            'amount.min' => 'Amount must be at least 0.01.',
            'category.required' => 'Please select an expense category.',
            'expense_date.required' => 'Expense date is required.',
            'expense_date.before_or_equal' => 'Expense date cannot be in the future.',
            'payment_method.required' => 'Payment method is required.',
            'receipt.mimes' => 'Receipt must be a JPEG, PNG, JPG, or PDF file.',
            'receipt.max' => 'Receipt file size cannot exceed 5MB.',
        ];
    }
}
