import { FormEventHandler, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Member, Plan } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: Member[];
    plans: Plan[];
}

export default function CreateSubscriptionModal({ open, onOpenChange, members, plans }: Props) {
    const [recordPayment, setRecordPayment] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        plan_id: '',
        start_date: new Date().toISOString().split('T')[0],
        status: 'pending' as 'pending' | 'active' | 'expired' | 'cancelled',
        notes: '',
        // Payment fields (optional)
        payment_amount: '',
        payment_method: 'cash' as 'cash' | 'card' | 'upi' | 'bank_transfer',
        payment_type: 'plan' as 'plan' | 'admission',
        payment_date: new Date().toISOString().split('T')[0],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/subscriptions', {
            onSuccess: () => {
                reset();
                setRecordPayment(false);
                onOpenChange(false);
                toast.success('Subscription created successfully');
            },
            onError: () => {
                toast.error('Failed to create subscription');
            },
        });
    };

    const selectedPlan = plans.find(p => p.id === parseInt(data.plan_id));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Subscription</DialogTitle>
                    <DialogDescription>Assign a plan to a member</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="member_id">Member *</Label>
                            <Select value={data.member_id} onValueChange={(value) => setData('member_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((member) => (
                                        <SelectItem key={member.id} value={member.id.toString()}>
                                            {member.user?.name || 'Unknown'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.member_id && <p className="text-sm text-destructive">{errors.member_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plan_id">Plan *</Label>
                            <Select value={data.plan_id} onValueChange={(value) => {
                                setData('plan_id', value);
                                const plan = plans.find(p => p.id === parseInt(value));
                                if (plan && recordPayment) {
                                    setData('payment_amount', plan.price.toString());
                                }
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id.toString()}>
                                            {plan.name} - ₹{plan.price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plan_id && <p className="text-sm text-destructive">{errors.plan_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedPlan && (
                            <div className="space-y-2 col-span-2">
                                <div className="text-sm text-muted-foreground">
                                    Duration: {selectedPlan.duration_months} month(s) | 
                                    Plan Fee: ₹{selectedPlan.price} | 
                                    Admission Fee: ₹{selectedPlan.admission_fee || 0}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 col-span-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="record_payment" 
                                    checked={recordPayment}
                                    onCheckedChange={(checked) => setRecordPayment(checked as boolean)}
                                />
                                <Label htmlFor="record_payment" className="cursor-pointer">
                                    Record payment now
                                </Label>
                            </div>
                        </div>

                        {recordPayment && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_amount">Payment Amount *</Label>
                                    <Input
                                        id="payment_amount"
                                        type="number"
                                        step="0.01"
                                        value={data.payment_amount}
                                        onChange={(e) => setData('payment_amount', e.target.value)}
                                        placeholder="0.00"
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
                                        </SelectContent>
                                    </Select>
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
                            </>
                        )}

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
                            Create Subscription
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
