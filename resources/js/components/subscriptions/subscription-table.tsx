import { Subscription } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    subscriptions: Subscription[];
    onEdit?: (subscription: Subscription) => void;
    onDelete?: (subscription: Subscription) => void;
}

const statusColors = {
    active: 'bg-green-500',
    expired: 'bg-red-500',
    cancelled: 'bg-gray-500',
};

const paymentColors = {
    paid: 'bg-green-500',
    pending: 'bg-yellow-500',
    overdue: 'bg-red-500',
};

export default function SubscriptionTable({ subscriptions, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.member?.name}</TableCell>
                        <TableCell>{subscription.plan?.name}</TableCell>
                        <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{subscription.amount_paid}</TableCell>
                        <TableCell>
                            <Badge className={paymentColors[subscription.payment_status]}>
                                {subscription.payment_status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={statusColors[subscription.status]}>
                                {subscription.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(subscription)}>
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
