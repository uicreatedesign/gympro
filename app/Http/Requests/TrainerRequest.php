<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrainerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_trainers'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_trainers'),
            'DELETE' => $this->user()->hasPermission('delete_trainers'),
            default => false,
        };
    }

    public function rules(): array
    {
        $trainerId = $this->route('trainer')?->user_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($trainerId),
            ],
            'phone' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'max:20'],
            'specialization' => ['required', 'string', 'max:255'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:50'],
            'salary' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'joining_date' => ['required', 'date', 'before_or_equal:today'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'password' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Trainer name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Phone number must be 10-15 digits.',
            'specialization.required' => 'Specialization is required.',
            'experience_years.required' => 'Years of experience is required.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        ];
    }
}
