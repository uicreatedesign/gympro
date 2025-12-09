<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    protected $fillable = [
        'user_id',
        'specialization',
        'experience_years',
        'salary',
        'joining_date',
        'bio',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
