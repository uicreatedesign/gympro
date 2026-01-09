<?php

namespace App\Notifications\Contracts;

use App\Models\User;

interface NotificationChannel
{
    public function send(User $user, array $notification): bool;

    public function isEnabledFor(User $user): bool;

    public function getName(): string;

    public function canSend(User $user): bool;
}
