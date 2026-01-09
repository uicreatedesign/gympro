<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\NotificationDispatcher;
use App\Notifications\Events\NotificationEvent;

class NotificationService
{
    private NotificationDispatcher $dispatcher;

    public function __construct()
    {
        $this->dispatcher = new NotificationDispatcher();
    }

    public function dispatchEvent(NotificationEvent $event): array
    {
        $user = $event->getUser();
        $notificationData = $event->getNotificationData();
        $preferredChannels = $event->getPreferredChannels();

        // Store in-app notification
        $this->storeInAppNotification($user, $notificationData);

        // Dispatch to channels
        return $this->dispatcher->dispatch($user, $notificationData, $preferredChannels);
    }

    private function storeInAppNotification(User $user, array $data): Notification
    {
        return $user->notifications()->create([
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'priority' => $data['priority'] ?? 'normal',
            'color' => $data['color'] ?? '#3b82f6',
        ]);
    }

    public function create(array $data)
    {
        return Notification::create([
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'user_id' => $data['user_id'] ?? null,
            'priority' => $data['priority'] ?? 'normal',
            'icon' => $data['icon'] ?? null,
            'color' => $data['color'] ?? '#3b82f6',
        ]);
    }

    public function createForUser(User $user, array $data)
    {
        return $this->create(array_merge($data, ['user_id' => $user->id]));
    }

    public function createSystemWide(array $data)
    {
        return $this->create(array_merge($data, ['user_id' => null]));
    }
}
