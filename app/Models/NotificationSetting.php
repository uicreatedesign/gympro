<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = [
        'event_type',
        'channel',
        'enabled',
        'recipients',
        'template_data',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'recipients' => 'array',
        'template_data' => 'array',
    ];
}
