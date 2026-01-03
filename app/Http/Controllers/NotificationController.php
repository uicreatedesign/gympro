<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::forUser(auth()->id())
            ->with('user')
            ->latest();

        if ($request->filter === 'unread') {
            $query->unread();
        } elseif ($request->filter === 'read') {
            $query->read();
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $notifications = $query->paginate(20);

        $stats = [
            'total' => Notification::forUser(auth()->id())->count(),
            'unread' => Notification::forUser(auth()->id())->unread()->count(),
            'read' => Notification::forUser(auth()->id())->read()->count(),
        ];

        $types = Notification::forUser(auth()->id())
            ->select('type')
            ->distinct()
            ->pluck('type')
            ->map(fn($type) => ['value' => $type, 'label' => ucwords(str_replace('_', ' ', $type))])
            ->values();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'stats' => $stats,
            'types' => $types,
            'filters' => [
                'filter' => $request->get('filter'),
                'type' => $request->get('type'),
            ],
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id === auth()->id() || is_null($notification->user_id)) {
            $notification->markAsRead();
        }

        return back();
    }

    public function markAllAsRead()
    {
        Notification::forUser(auth()->id())->unread()->update(['read_at' => now()]);
        
        return back();
    }

    public function destroy(Notification $notification)
    {
        if ($notification->user_id === auth()->id() || is_null($notification->user_id)) {
            $notification->delete();
        }

        return back();
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,normal,high,urgent',
            'color' => 'required|string|max:7',
        ]);

        NotificationService::createSystemWide([
            'type' => $request->type,
            'title' => $request->title,
            'message' => $request->message,
            'priority' => $request->priority,
            'color' => $request->color,
        ]);

        return back();
    }

    public function getUnreadCount()
    {
        return response()->json([
            'count' => Notification::forUser(auth()->id())->unread()->count()
        ]);
    }

    public function getRecent()
    {
        $notifications = Notification::forUser(auth()->id())
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'created_at' => $notification->created_at->toISOString(),
                    'read_at' => $notification->read_at?->toISOString(),
                ];
            });

        return response()->json($notifications);
    }
}
