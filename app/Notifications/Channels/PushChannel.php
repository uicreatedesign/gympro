<?php

namespace App\Notifications\Channels;

use App\Models\User;
use App\Notifications\Contracts\NotificationChannel;

class PushChannel implements NotificationChannel
{
    public function send(User $user, array $notification): bool
    {
        if (!$this->canSend($user)) {
            return false;
        }

        try {
            // Store in-app notification
            $user->notifications()->create([
                'type' => $notification['type'],
                'title' => $notification['title'],
                'message' => $notification['message'],
                'data' => $notification['data'] ?? null,
                'priority' => $notification['priority'] ?? 'normal',
                'color' => $notification['color'] ?? '#3b82f6',
            ]);

            // TODO: Integrate with Firebase Cloud Messaging or similar
            // $this->sendToFCM($user, $notification);

            return true;
        } catch (\Exception $e) {
            \Log::error('Push notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function isEnabledFor(User $user): bool
    {
        return $user->notificationSettings()
            ->where('channel', 'push')
            ->where('enabled', true)
            ->exists();
    }

    public function getName(): string
    {
        return 'push';
    }

    public function canSend(User $user): bool
    {
        return $this->isEnabledFor($user);
    }
}
