<?php

namespace App\Notifications\Channels;

use App\Models\User;
use App\Notifications\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Mail;

class EmailChannel implements NotificationChannel
{
    public function send(User $user, array $notification): bool
    {
        if (!$this->canSend($user)) {
            return false;
        }

        try {
            Mail::send('emails.notification', [
                'title' => $notification['title'],
                'message' => $notification['message'],
                'data' => $notification['data'] ?? [],
            ], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject($notification['title'] ?? 'Notification');
            });

            return true;
        } catch (\Exception $e) {
            \Log::error('Email notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function isEnabledFor(User $user): bool
    {
        return $user->notificationSettings()
            ->where('channel', 'email')
            ->where('enabled', true)
            ->exists();
    }

    public function getName(): string
    {
        return 'email';
    }

    public function canSend(User $user): bool
    {
        return !empty($user->email) && $this->isEnabledFor($user);
    }
}
