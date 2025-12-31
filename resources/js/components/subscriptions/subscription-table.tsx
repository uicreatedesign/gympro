import { Subscription } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

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
                    <TableHead className="w-16">Sr No</TableHead>
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
                {subscriptions.map((subscription, index) => (
                    <TableRow key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{subscription.member?.name}</TableCell>
                        <TableCell>{subscription.plan?.name}</TableCell>
                        <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{subscription.amount_paid}</TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline" 
                                className={
                                    subscription.payment_status === 'paid' 
                                        ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                        : subscription.payment_status === 'pending'
                                        ? 'border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-950'
                                        : 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950'
                                }
                            >
                                {subscription.payment_status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline"
                                className={
                                    subscription.status === 'active'
                                        ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                        : subscription.status === 'expired'
                                        ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950'
                                        : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950'
                                }
                            >
                                {subscription.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onEdit && (
                                        <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button variant="outline" size="sm" onClick={() => onDelete(subscription)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
