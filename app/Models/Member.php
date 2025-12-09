<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'gender',
        'date_of_birth',
        'address',
        'photo',
        'join_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'join_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
