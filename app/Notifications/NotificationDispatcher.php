<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Channels\EmailChannel;
use App\Notifications\Channels\PushChannel;
use App\Notifications\Channels\SMSChannel;
use App\Notifications\Channels\WhatsAppChannel;
use App\Notifications\Contracts\NotificationChannel;

class NotificationDispatcher
{
    private array $channels = [];

    public function __construct()
    {
        $this->registerChannels();
    }

    private function registerChannels(): void
    {
        $this->channels = [
            'email' => new EmailChannel(),
            'push' => new PushChannel(),
            'sms' => new SMSChannel(),
            'whatsapp' => new WhatsAppChannel(),
        ];
    }

    public function dispatch(User $user, array $notification, array $preferredChannels = []): array
    {
        $results = [];
        $channelsToUse = empty($preferredChannels) ? array_keys($this->channels) : $preferredChannels;

        foreach ($channelsToUse as $channelName) {
            if (!isset($this->channels[$channelName])) {
                continue;
            }

            $channel = $this->channels[$channelName];
            $results[$channelName] = $channel->send($user, $notification);
        }

        return $results;
    }

    public function getChannel(string $name): ?NotificationChannel
    {
        return $this->channels[$name] ?? null;
    }

    public function getAvailableChannels(User $user): array
    {
        return array_filter(
            $this->channels,
            fn($channel) => $channel->canSend($user)
        );
    }
}
