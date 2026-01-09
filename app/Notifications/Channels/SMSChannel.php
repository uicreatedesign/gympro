<?php

namespace App\Notifications\Channels;

use App\Models\User;
use App\Notifications\Contracts\NotificationChannel;

class SMSChannel implements NotificationChannel
{
    public function send(User $user, array $notification): bool
    {
        if (!$this->canSend($user)) {
            return false;
        }

        try {
            // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
            // $this->sendSMS($user->phone, $notification['message']);

            return true;
        } catch (\Exception $e) {
            \Log::error('SMS notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function isEnabledFor(User $user): bool
    {
        return $user->notificationSettings()
            ->where('channel', 'sms')
            ->where('enabled', true)
            ->exists();
    }

    public function getName(): string
    {
        return 'sms';
    }

    public function canSend(User $user): bool
    {
        return !empty($user->phone) && $this->isEnabledFor($user);
    }
}
