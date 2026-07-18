<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return match ($this->method()) {
            'POST' => $this->user()->hasPermission('create_roles'),
            'PUT', 'PATCH' => $this->user()->hasPermission('edit_roles'),
            'DELETE' => $this->user()->hasPermission('delete_roles'),
            default => false,
        };
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($roleId),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Role name is required.',
            'name.unique' => 'This role name already exists.',
            'permissions.required' => 'Please assign at least one permission.',
            'permissions.min' => 'Role must have at least one permission.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }
    
    /**
     * Prevent deleting or modifying system roles
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $systemRoles = ['Admin', 'Manager', 'Trainer', 'Viewer', 'Member'];
            
            if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                $role = $this->route('role');
                
                if ($role && in_array($role->name, $systemRoles)) {
                    // Allow permission changes but not name changes for system roles
                    if ($this->input('name') !== $role->name) {
                        $validator->errors()->add('name', 'Cannot rename system roles.');
                    }
                }
            }
            
            if ($this->isMethod('DELETE')) {
                $role = $this->route('role');
                
                if ($role && in_array($role->name, $systemRoles)) {
                    $validator->errors()->add('role', 'Cannot delete system roles.');
                }
                
                // Prevent deleting roles with assigned users
                if ($role && $role->users()->count() > 0) {
                    $validator->errors()->add('role', 'Cannot delete a role that is assigned to users.');
                }
            }
        });
    }
}
