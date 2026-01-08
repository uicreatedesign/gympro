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
        'description',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'admission_fee' => 'decimal:2',
    ];

    /**
     * Get features for this plan
     */
    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'plan_features');
    }

    /**
     * Get subscriptions for this plan
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
