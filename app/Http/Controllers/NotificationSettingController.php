<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingController extends Controller
{
    private $eventTypes = [
        'member_registered' => 'Member Registered',
        'subscription_created' => 'Subscription Created',
        'subscription_expiring' => 'Subscription Expiring',
        'subscription_expired' => 'Subscription Expired',
        'payment_received' => 'Payment Received',
        'payment_failed' => 'Payment Failed',
        'attendance_marked' => 'Attendance Marked',
    ];

    public function index()
    {
        if (!auth()->user()->hasPermission('view_notifications')) {
            abort(403, 'Unauthorized');
        }

        $settings = NotificationSetting::where('channel', 'email')->get()->keyBy('event_type');
        
        $notificationSettings = collect($this->eventTypes)->map(function ($label, $eventType) use ($settings) {
            $setting = $settings->get($eventType);
            return [
                'event_type' => $eventType,
                'label' => $label,
                'enabled' => $setting ? $setting->enabled : false,
            ];
        })->values();

        return Inertia::render('settings/notifications', [
            'notificationSettings' => $notificationSettings,
        ]);
    }

    public function update(Request $request)
    {
        if (!auth()->user()->hasPermission('edit_notifications')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.event_type' => 'required|string',
            'settings.*.enabled' => 'required|boolean',
        ]);

        foreach ($validated['settings'] as $setting) {
            NotificationSetting::updateOrCreate(
                [
                    'event_type' => $setting['event_type'],
                    'channel' => 'email',
                ],
                [
                    'enabled' => $setting['enabled'],
                ]
            );
        }

        return redirect()->back();
    }
}
