import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subscription } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscriptions: Subscription[];
}

export default function CreatePaymentModal({ open, onOpenChange, subscriptions }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        subscription_id: '',
        amount: '',
        payment_method: 'cash' as 'cash' | 'card' | 'upi' | 'bank_transfer',
        payment_type: 'plan' as 'plan' | 'admission' | 'renewal',
        payment_date: new Date().toISOString().split('T')[0],
        status: 'completed' as 'completed' | 'pending' | 'failed',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/payments', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Payment recorded successfully');
            },
            onError: () => {
                toast.error('Failed to record payment');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>Record a manual payment for a subscription</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="subscription_id">Subscription *</Label>
                            <Select value={data.subscription_id} onValueChange={(value) => setData('subscription_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subscription" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subscriptions?.map((sub: any) => (
                                        <SelectItem key={sub.id} value={sub.id.toString()}>
                                            {sub.member?.name} - {sub.plan?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subscription_id && <p className="text-sm text-destructive">{errors.subscription_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_date">Payment Date *</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_method">Payment Method *</Label>
                            <Select value={data.payment_method} onValueChange={(value: any) => setData('payment_method', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_type">Payment Type *</Label>
                            <Select value={data.payment_type} onValueChange={(value: any) => setData('payment_type', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plan">Plan Fee</SelectItem>
                                    <SelectItem value="admission">Admission Fee</SelectItem>
                                    <SelectItem value="renewal">Renewal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Optional notes..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Record Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
