import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Payment, Member, Subscription } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment: Payment;
}

export default function EditPaymentModal({ open, onOpenChange, payment }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        member_id: 'none',
        subscription_id: 'none',
        amount: '',
        payment_method: 'cash',
        payment_type: 'subscription',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: '',
        transaction_id: '',
    });

    useEffect(() => {
        if (payment && open) {
            setData({
                member_id: payment.member_id?.toString() || 'none',
                subscription_id: payment.subscription_id?.toString() || 'none',
                amount: payment.amount || '',
                payment_method: payment.payment_method || 'cash',
                payment_type: payment.payment_type || 'subscription',
                payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : new Date().toISOString().split('T')[0],
                status: payment.status || 'completed',
                notes: payment.notes || '',
                transaction_id: payment.transaction_id || '',
            });
        }
    }, [payment, open]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/payments/${payment.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Payment updated successfully');
            },
            onError: () => {
                toast.error('Failed to update payment');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Payment</DialogTitle>
                    <DialogDescription>Update payment information</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="member_id">Member</Label>
                            <Select value={data.member_id} onValueChange={(value) => setData('member_id', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={data.member_id === 'none' ? 'none' : data.member_id}>{payment.member?.name || 'Select Member'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subscription_id">Subscription (Optional)</Label>
                            <Select value={data.subscription_id || 'none'} onValueChange={(value) => setData('subscription_id', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method</Label>
                            <Select value={data.payment_method} onValueChange={(value: any) => setData('payment_method', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="phonepe">PhonePe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_type">Payment Type</Label>
                            <Select value={data.payment_type} onValueChange={(value: any) => setData('payment_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plan">Plan</SelectItem>
                                    <SelectItem value="admission">Admission</SelectItem>
                                    <SelectItem value="renewal">Renewal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_date">Payment Date</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transaction_id">Transaction ID</Label>
                            <Input
                                id="transaction_id"
                                value={data.transaction_id}
                                onChange={(e) => setData('transaction_id', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
