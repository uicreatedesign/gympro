<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'member_id',
        'subscription_id',
        'invoice_number',
        'amount',
        'payment_method',
        'payment_type',
        'payment_date',
        'status',
        'notes',
        'transaction_id',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public static function generateInvoiceNumber()
    {
        $lastPayment = self::latest('id')->first();
        $number = $lastPayment ? intval(substr($lastPayment->invoice_number, 4)) + 1 : 1;
        return 'INV-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
