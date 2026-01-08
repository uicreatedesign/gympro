<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExerciseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $exerciseId = $this->route('exercise')?->id;
        $isUpdate = $this->isMethod('post') && $this->has('_method') && $this->input('_method') === 'PUT';

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('exercises', 'name')->ignore($exerciseId),
            ],
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|max:100',
            'muscle_group' => 'required|string|max:100',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'instructions' => 'nullable|string|max:2000',
            'image_primary' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'image_secondary' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'video_url' => 'nullable|url',
            'equipment_required' => 'nullable|string|max:255',
            'duration_seconds' => 'nullable|integer|min:0|max:3600',
            'calories_burned' => 'nullable|integer|min:0|max:1000',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'An exercise with this name already exists.',
            'name.required' => 'Exercise name is required.',
            'name.max' => 'Exercise name cannot exceed 255 characters.',
            'category.required' => 'Category is required.',
            'muscle_group.required' => 'Muscle group is required.',
            'difficulty.required' => 'Difficulty level is required.',
            'difficulty.in' => 'Difficulty must be beginner, intermediate, or advanced.',
            'image_primary.image' => 'Primary image must be a valid image file.',
            'image_primary.mimes' => 'Primary image must be JPEG, PNG, JPG, or WebP.',
            'image_primary.max' => 'Primary image cannot exceed 2MB.',
            'image_secondary.image' => 'Secondary image must be a valid image file.',
            'image_secondary.mimes' => 'Secondary image must be JPEG, PNG, JPG, or WebP.',
            'image_secondary.max' => 'Secondary image cannot exceed 2MB.',
            'video_url.url' => 'Video URL must be a valid URL.',
            'duration_seconds.max' => 'Duration cannot exceed 3600 seconds (1 hour).',
            'calories_burned.max' => 'Calories burned cannot exceed 1000.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be active or inactive.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->video_url && !preg_match('/(youtube\.com|youtu\.be|vimeo\.com)/', $this->video_url)) {
                $validator->errors()->add('video_url', 'Video URL must be from YouTube or Vimeo.');
            }
        });
    }
}
