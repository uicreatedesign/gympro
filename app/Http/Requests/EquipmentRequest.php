<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_equipment'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_equipment'),
            'DELETE' => $this->user()->hasPermission('delete_equipment'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in([
                'cardio',
                'strength',
                'free_weights',
                'functional',
                'stretching',
                'accessories',
                'other'
            ])],
            'quantity' => ['required', 'integer', 'min:0', 'max:1000'],
            'purchase_price' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'purchase_date' => ['nullable', 'date', 'before_or_equal:today'],
            'condition' => ['required', Rule::in(['new', 'good', 'fair', 'poor', 'needs_repair'])],
            'status' => ['required', Rule::in(['active', 'maintenance', 'retired'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'], // 3MB
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Equipment name is required.',
            'category.required' => 'Please select an equipment category.',
            'quantity.required' => 'Quantity is required.',
            'quantity.min' => 'Quantity cannot be negative.',
            'condition.required' => 'Equipment condition is required.',
            'status.required' => 'Equipment status is required.',
            'purchase_date.before_or_equal' => 'Purchase date cannot be in the future.',
            'photo.mimes' => 'Photo must be a JPEG, PNG, JPG, or WebP image.',
            'photo.max' => 'Photo size cannot exceed 3MB.',
        ];
    }
}
