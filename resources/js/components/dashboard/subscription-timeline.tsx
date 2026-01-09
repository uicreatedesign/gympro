import { Subscription } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline, TimelineItem, TimelineHeader, TimelineSeparator, TimelineIcon, TimelineBody } from '@/components/ui/timeline';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SubscriptionTimelineProps {
    subscriptions: Subscription[];
}

export default function SubscriptionTimeline({ subscriptions }: SubscriptionTimelineProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
            case 'expired':
                return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'expired':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getTimelineColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'expired':
                return 'error';
            default:
                return 'secondary';
        }
    };

    return (
        <div>
            <CardHeader>
                <CardTitle>Recent Subscriptions</CardTitle>
                <CardDescription className='mb-5'>Latest member subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
                {subscriptions.length > 0 ? (
                    <Timeline color={getTimelineColor(subscriptions[0]?.status || 'secondary')}>
                        {subscriptions.map((subscription) => (
                            console.log(subscription),
                            <TimelineItem key={subscription.id}>
                                <TimelineHeader>
                                    <TimelineSeparator />
                                    <TimelineIcon>
                                        {getStatusIcon(subscription.status)}
                                    </TimelineIcon>
                                </TimelineHeader>
                                <TimelineBody>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{subscription.plan?.name}</p>
                                            <Badge className={getStatusColor(subscription.status)}>
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                        
                                        
                                        <p className="text-sm text-muted-foreground">{subscription.member?.user?.name} • ₹{subscription.total_paid || 0}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(subscription.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}, {new Date(subscription.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </TimelineBody>
                            </TimelineItem>
                        ))}
                    </Timeline>
                ) : (
                    <p className="text-sm text-muted-foreground">No recent subscriptions</p>
                )}
            </CardContent>
        </div>
    );
}
