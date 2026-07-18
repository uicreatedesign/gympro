<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_plans'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_plans'),
            'DELETE' => $this->user()->hasPermission('delete_plans'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'duration_months' => ['required', 'integer', 'min:1', 'max:60'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'admission_fee' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'shift' => ['required', Rule::in(['morning', 'evening', 'full_day'])],
            'shift_time' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'features' => ['nullable', 'array'],
            'features.*' => ['integer', 'exists:features,id'],
            
            // Legacy boolean features (if still used)
            'personal_training' => ['nullable', 'boolean'],
            'group_classes' => ['nullable', 'boolean'],
            'locker_facility' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Plan name is required.',
            'duration_months.required' => 'Duration is required.',
            'duration_months.min' => 'Duration must be at least 1 month.',
            'duration_months.max' => 'Duration cannot exceed 60 months.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'features.*.exists' => 'One or more selected features are invalid.',
        ];
    }
}
