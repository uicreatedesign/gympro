<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_users'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_users'),
            'DELETE' => $this->user()->hasPermission('delete_users'),
            default => false,
        };
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => ['nullable', 'string', 'regex:/^[0-9]{10,15}$/', 'max:20'],
            'password' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
            ],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['integer', 'exists:roles,id'],
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'User name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email is already registered.',
            'phone.regex' => 'Phone number must be 10-15 digits.',
            'password.required' => 'Password is required for new users.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'roles.required' => 'Please assign at least one role.',
            'roles.*.exists' => 'One or more selected roles are invalid.',
            'profile_image.max' => 'Profile image cannot exceed 2MB.',
        ];
    }
    
    /**
     * Prevent self-demotion from Admin role
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                $user = $this->route('user');
                
                // Prevent editing own account to remove admin privileges
                if ($user && $user->id === $this->user()->id) {
                    $currentRoles = $user->roles->pluck('id')->toArray();
                    $newRoles = $this->input('roles', []);
                    
                    $adminRole = \App\Models\Role::where('name', 'Admin')->first();
                    
                    if ($adminRole && in_array($adminRole->id, $currentRoles) && !in_array($adminRole->id, $newRoles)) {
                        $validator->errors()->add('roles', 'You cannot remove your own admin privileges.');
                    }
                }
            }
        });
    }
}
