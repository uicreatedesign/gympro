<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class UpdateExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:update-expired';
    protected $description = 'Update subscriptions that have expired and send notifications';

    public function handle(SubscriptionService $subscriptionService)
    {
        $expiredCount = $subscriptionService->updateExpiredSubscriptions();
        
        $this->info("Updated {$expiredCount} expired subscriptions and sent notifications");
    }
}
