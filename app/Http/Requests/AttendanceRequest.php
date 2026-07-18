<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_attendances'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_attendances'),
            'DELETE' => $this->user()->hasPermission('delete_attendances'),
            default => false,
        };
    }

    public function rules(): array
    {
        return [
            'member_id' => ['required', 'integer', 'exists:members,id'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'check_in_time' => ['required', 'date_format:H:i'],
            'check_out_time' => ['nullable', 'date_format:H:i', 'after:check_in_time'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'Selected member does not exist.',
            'date.required' => 'Attendance date is required.',
            'date.before_or_equal' => 'Attendance date cannot be in the future.',
            'check_in_time.required' => 'Check-in time is required.',
            'check_in_time.date_format' => 'Check-in time must be in HH:MM format.',
            'check_out_time.after' => 'Check-out time must be after check-in time.',
        ];
    }
    
    /**
     * Validate that member has active subscription
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $memberId = $this->input('member_id');
            $date = $this->input('date');
            
            if ($memberId && $date) {
                $hasActiveSubscription = \App\Models\Subscription::where('member_id', $memberId)
                    ->where('status', 'active')
                    ->where('start_date', '<=', $date)
                    ->where('end_date', '>=', $date)
                    ->exists();
                    
                if (!$hasActiveSubscription) {
                    $validator->errors()->add('member_id', 'Member does not have an active subscription for this date.');
                }
                
                // Check for duplicate attendance on same date
                $duplicate = \App\Models\Attendance::where('member_id', $memberId)
                    ->whereDate('date', $date)
                    ->when($this->route('attendance'), fn($q) => $q->where('id', '!=', $this->route('attendance')->id))
                    ->exists();
                    
                if ($duplicate) {
                    $validator->errors()->add('date', 'Attendance already recorded for this member on this date.');
                }
            }
        });
    }
}
