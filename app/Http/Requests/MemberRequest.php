<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_members'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_members'),
            'DELETE' => $this->user()->hasPermission('delete_members'),
            default => false,
        };
    }

    public function rules(): array
    {
        $memberId = $this->route('member')?->user_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($memberId),
            ],
            'phone' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'max:20'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date', 'before:today', 'after:1900-01-01'],
            'address' => ['nullable', 'string', 'max:500'],
            'join_date' => ['required', 'date', 'before_or_equal:today'],
            'status' => ['required', Rule::in(['active', 'inactive', 'expired'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'password' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // At least one uppercase, lowercase, and number
            ],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Member name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Phone number must be 10-15 digits.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        ];
    }
}
