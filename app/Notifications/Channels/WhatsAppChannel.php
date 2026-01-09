<?php

namespace App\Notifications\Channels;

use App\Models\User;
use App\Notifications\Contracts\NotificationChannel;

class WhatsAppChannel implements NotificationChannel
{
    public function send(User $user, array $notification): bool
    {
        if (!$this->canSend($user)) {
            return false;
        }

        try {
            // TODO: Integrate with WhatsApp Business API or Twilio
            // $this->sendWhatsApp($user->phone, $notification['message']);

            return true;
        } catch (\Exception $e) {
            \Log::error('WhatsApp notification failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function isEnabledFor(User $user): bool
    {
        return $user->notificationSettings()
            ->where('channel', 'whatsapp')
            ->where('enabled', true)
            ->exists();
    }

    public function getName(): string
    {
        return 'whatsapp';
    }

    public function canSend(User $user): bool
    {
        return !empty($user->phone) && $this->isEnabledFor($user);
    }
}
