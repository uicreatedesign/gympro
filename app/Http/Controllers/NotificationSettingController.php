<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingController extends Controller
{
    public function index()
    {
        $settings = [
            'email_enabled' => NotificationSetting::where('channel', 'email')->where('event_type', 'global')->value('enabled') ?? false,
            'whatsapp_enabled' => NotificationSetting::where('channel', 'whatsapp')->where('event_type', 'global')->value('enabled') ?? false,
            'sms_enabled' => NotificationSetting::where('channel', 'sms')->where('event_type', 'global')->value('enabled') ?? false,
            'push_enabled' => NotificationSetting::where('channel', 'in_app')->where('event_type', 'global')->value('enabled') ?? true,
            'member_registered' => NotificationSetting::where('event_type', 'member_registered')->where('channel', 'in_app')->value('enabled') ?? false,
            'subscription_created' => NotificationSetting::where('event_type', 'subscription_created')->where('channel', 'in_app')->value('enabled') ?? false,
            'subscription_expiring' => NotificationSetting::where('event_type', 'subscription_expiring')->where('channel', 'in_app')->value('enabled') ?? false,
            'subscription_expired' => NotificationSetting::where('event_type', 'subscription_expired')->where('channel', 'in_app')->value('enabled') ?? false,
            'payment_received' => NotificationSetting::where('event_type', 'payment_received')->where('channel', 'in_app')->value('enabled') ?? false,
            'payment_failed' => NotificationSetting::where('event_type', 'payment_failed')->where('channel', 'in_app')->value('enabled') ?? false,
            'attendance_marked' => NotificationSetting::where('event_type', 'attendance_marked')->where('channel', 'in_app')->value('enabled') ?? false,
        ];

        return Inertia::render('settings/notifications', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'email_enabled' => 'required|boolean',
            'whatsapp_enabled' => 'required|boolean',
            'sms_enabled' => 'required|boolean',
            'push_enabled' => 'required|boolean',
            'member_registered' => 'required|boolean',
            'subscription_created' => 'required|boolean',
            'subscription_expiring' => 'required|boolean',
            'subscription_expired' => 'required|boolean',
            'payment_received' => 'required|boolean',
            'payment_failed' => 'required|boolean',
            'attendance_marked' => 'required|boolean',
        ]);

        NotificationSetting::updateOrCreate(['channel' => 'email', 'event_type' => 'global'], ['enabled' => $validated['email_enabled']]);
        NotificationSetting::updateOrCreate(['channel' => 'whatsapp', 'event_type' => 'global'], ['enabled' => $validated['whatsapp_enabled']]);
        NotificationSetting::updateOrCreate(['channel' => 'sms', 'event_type' => 'global'], ['enabled' => $validated['sms_enabled']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'global'], ['enabled' => $validated['push_enabled']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'member_registered'], ['enabled' => $validated['member_registered']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'subscription_created'], ['enabled' => $validated['subscription_created']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'subscription_expiring'], ['enabled' => $validated['subscription_expiring']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'subscription_expired'], ['enabled' => $validated['subscription_expired']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'payment_received'], ['enabled' => $validated['payment_received']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'payment_failed'], ['enabled' => $validated['payment_failed']]);
        NotificationSetting::updateOrCreate(['channel' => 'in_app', 'event_type' => 'attendance_marked'], ['enabled' => $validated['attendance_marked']]);

        return redirect()->back();
    }
}
