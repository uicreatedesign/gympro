<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'duration_months',
        'price',
        'admission_fee',
        'shift',
        'shift_time',
        'personal_training',
        'group_classes',
        'locker_facility',
        'description',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'admission_fee' => 'decimal:2',
        'personal_training' => 'boolean',
        'group_classes' => 'boolean',
        'locker_facility' => 'boolean',
    ];

    /**
     * Get the exercises assigned to this plan
     */
    public function exercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'exercise_plan')
            ->withPivot(['sets', 'reps', 'duration_seconds', 'rest_seconds', 'order', 'notes'])
            ->orderBy('pivot_order')
            ->withTimestamps();
    }

    /**
     * Get workouts associated with this plan
     */
    public function workouts(): HasMany
    {
        return $this->hasMany(Workout::class);
    }
}
