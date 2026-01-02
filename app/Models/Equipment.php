<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $fillable = [
        'name',
        'category',
        'photo',
        'quantity',
        'purchase_price',
        'purchase_date',
        'condition',
        'status',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_price' => 'decimal:2',
        'quantity' => 'integer',
    ];
}
