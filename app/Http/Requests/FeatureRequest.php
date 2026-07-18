<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Features should be managed by admins/managers only
        return $this->user()->hasPermission('edit_plans') || $this->user()->hasPermission('create_plans');
    }

    public function rules(): array
    {
        $featureId = $this->route('feature')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('features', 'slug')->ignore($featureId),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Feature name is required.',
            'slug.required' => 'Feature slug is required.',
            'slug.unique' => 'This feature slug already exists.',
            'slug.regex' => 'Slug must be lowercase with hyphens (e.g., personal-training).',
            'status.required' => 'Feature status is required.',
        ];
    }
    
    /**
     * Auto-generate slug from name if not provided
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && !$this->filled('slug')) {
            $this->merge([
                'slug' => \Illuminate\Support\Str::slug($this->name),
            ]);
        }
    }
}
