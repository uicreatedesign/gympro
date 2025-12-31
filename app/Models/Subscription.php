<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    protected $fillable = [
        'member_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['total_paid', 'payment_status'];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Computed attributes
    public function getTotalPaidAttribute()
    {
        return $this->payments()->where('status', 'completed')->sum('amount');
    }

    public function getPaymentStatusAttribute()
    {
        $totalPaid = $this->total_paid;
        $planPrice = $this->plan->price ?? 0;
        $admissionFee = $this->plan->admission_fee ?? 0;
        $totalRequired = $planPrice + $admissionFee;

        if ($totalPaid >= $totalRequired) return 'paid';
        if ($totalPaid > 0) return 'partial';
        if ($this->end_date < now()) return 'overdue';
        return 'pending';
    }

    // Auto-activate subscription when fully paid
    public function checkAndActivate()
    {
        if ($this->payment_status === 'paid' && $this->status === 'pending') {
            $this->update(['status' => 'active']);
        }
    }
}
