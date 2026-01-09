<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingController extends Controller
{
    private const EVENTS = [
        'member_registered' => 'Member Registered',
        'subscription_created' => 'Subscription Created',
        'subscription_expiring' => 'Subscription Expiring',
        'subscription_expired' => 'Subscription Expired',
        'payment_received' => 'Payment Received',
        'payment_failed' => 'Payment Failed',
        'attendance_marked' => 'Attendance Marked',
    ];

    private const CHANNELS = ['email', 'push', 'sms', 'whatsapp'];

    public function index()
    {
        $user = auth()->user();
        $settings = [];

        foreach (self::EVENTS as $eventKey => $eventLabel) {
            $settings[$eventKey] = [];
            foreach (self::CHANNELS as $channel) {
                $setting = NotificationSetting::where('user_id', $user->id)
                    ->where('event_type', $eventKey)
                    ->where('channel', $channel)
                    ->first();
                $settings[$eventKey][$channel] = $setting?->enabled ?? true;
            }
        }

        return Inertia::render('settings/notifications', [
            'settings' => $settings,
            'events' => self::EVENTS,
            'channels' => self::CHANNELS,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        $user = auth()->user();

        foreach (self::EVENTS as $eventKey => $eventLabel) {
            foreach (self::CHANNELS as $channel) {
                $enabled = $validated['settings'][$eventKey][$channel] ?? true;
                NotificationSetting::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'event_type' => $eventKey,
                        'channel' => $channel,
                    ],
                    ['enabled' => $enabled]
                );
            }
        }

        return back()->with('success', 'Notification preferences updated successfully');
    }

    public function test(Request $request)
    {
        $validated = $request->validate([
            'channel' => 'required|in:email,push,sms,whatsapp',
        ]);

        $user = auth()->user();
        $channel = $validated['channel'];

        try {
            match ($channel) {
                'email' => \Mail::raw('This is a test notification from Gympro', function ($message) use ($user) {
                    $message->to($user->email)->subject('Test Notification - Gympro');
                }),
                'push' => app(NotificationService::class)->create([
                    'type' => 'test_notification',
                    'title' => 'Test Notification',
                    'message' => 'This is a test notification from Gympro',
                    'user_id' => $user->id,
                    'data' => ['test' => true],
                    'priority' => 'normal',
                    'color' => '#3b82f6',
                ]),
                default => null,
            };

            return response()->json(['success' => true, 'message' => "Test {$channel} notification sent"], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
