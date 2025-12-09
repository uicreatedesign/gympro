<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
