<?php

namespace App\Notifications\Events;

use App\Models\User;

abstract class NotificationEvent
{
    public function __construct(
        protected User $user,
        protected array $data = []
    ) {}

    abstract public function getNotificationData(): array;

    public function getUser(): User
    {
        return $this->user;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function getPreferredChannels(): array
    {
        return [];
    }
}
