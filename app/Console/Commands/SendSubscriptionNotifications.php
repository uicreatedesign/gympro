<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class SendSubscriptionNotifications extends Command
{
    protected $signature = 'subscriptions:notify-expiring {--days=7 : Days until expiration}';
    protected $description = 'Send notifications for subscriptions expiring soon';

    public function handle(SubscriptionService $subscriptionService)
    {
        $days = $this->option('days');
        
        $notifiedCount = $subscriptionService->notifyExpiringSubscriptions($days);
        
        $this->info("Sent {$notifiedCount} expiring subscription notifications");
    }
}
