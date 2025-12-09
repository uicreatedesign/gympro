import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member, Plan } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: Member[];
    plans: Plan[];
}

export default function CreateSubscriptionModal({ open, onOpenChange, members, plans }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        plan_id: '',
        start_date: new Date().toISOString().split('T')[0],
        amount_paid: '',
        admission_fee_paid: '',
        payment_status: 'pending' as 'pending' | 'paid' | 'overdue',
        status: 'active' as 'active' | 'expired' | 'cancelled',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/subscriptions', {
            onSuccess: () => {
                reset();
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                            {member.name}
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
                                if (plan) {
                                    setData('amount_paid', plan.price);
                                    setData('admission_fee_paid', plan.admission_fee);
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

                        {selectedPlan && (
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Input value={`${selectedPlan.duration_months} month(s)`} disabled />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="amount_paid">Amount Paid *</Label>
                            <Input
                                id="amount_paid"
                                type="number"
                                step="0.01"
                                value={data.amount_paid}
                                onChange={(e) => setData('amount_paid', e.target.value)}
                            />
                            {errors.amount_paid && <p className="text-sm text-destructive">{errors.amount_paid}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admission_fee_paid">Admission Fee</Label>
                            <Input
                                id="admission_fee_paid"
                                type="number"
                                step="0.01"
                                value={data.admission_fee_paid}
                                onChange={(e) => setData('admission_fee_paid', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_status">Payment Status *</Label>
                            <Select value={data.payment_status} onValueChange={(value: any) => setData('payment_status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
