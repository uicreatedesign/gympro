import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plan } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan;
}

export default function EditPlanModal({ open, onOpenChange, plan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        duration_months: plan.duration_months,
        price: plan.price,
        admission_fee: plan.admission_fee,
        shift: plan.shift,
        shift_time: plan.shift_time || '',
        personal_training: plan.personal_training,
        group_classes: plan.group_classes,
        locker_facility: plan.locker_facility,
        description: plan.description || '',
        status: plan.status,
    });

    useEffect(() => {
        setData({
            name: plan.name,
            duration_months: plan.duration_months,
            price: plan.price,
            admission_fee: plan.admission_fee,
            shift: plan.shift,
            shift_time: plan.shift_time || '',
            personal_training: plan.personal_training,
            group_classes: plan.group_classes,
            locker_facility: plan.locker_facility,
            description: plan.description || '',
            status: plan.status,
        });
    }, [plan]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/plans/${plan.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Plan updated successfully');
            },
            onError: () => {
                toast.error('Failed to update plan');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Plan</DialogTitle>
                    <DialogDescription>Update plan details</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration_months">Duration (Months) *</Label>
                            <Input
                                id="duration_months"
                                type="number"
                                min="1"
                                value={data.duration_months}
                                onChange={(e) => setData('duration_months', parseInt(e.target.value))}
                            />
                            {errors.duration_months && <p className="text-sm text-destructive">{errors.duration_months}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admission_fee">Admission Fee</Label>
                            <Input
                                id="admission_fee"
                                type="number"
                                step="0.01"
                                value={data.admission_fee}
                                onChange={(e) => setData('admission_fee', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shift">Shift *</Label>
                            <Select value={data.shift} onValueChange={(value: any) => setData('shift', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Morning</SelectItem>
                                    <SelectItem value="evening">Evening</SelectItem>
                                    <SelectItem value="full_day">Full Day</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shift_time">Shift Time</Label>
                            <Input
                                id="shift_time"
                                value={data.shift_time}
                                onChange={(e) => setData('shift_time', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 col-span-2">
                            <Label>Facilities</Label>
                            <div className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="personal_training"
                                        checked={data.personal_training}
                                        onCheckedChange={(checked) => setData('personal_training', !!checked)}
                                    />
                                    <label htmlFor="personal_training" className="text-sm cursor-pointer">
                                        Personal Training
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="group_classes"
                                        checked={data.group_classes}
                                        onCheckedChange={(checked) => setData('group_classes', !!checked)}
                                    />
                                    <label htmlFor="group_classes" className="text-sm cursor-pointer">
                                        Group Classes
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="locker_facility"
                                        checked={data.locker_facility}
                                        onCheckedChange={(checked) => setData('locker_facility', !!checked)}
                                    />
                                    <label htmlFor="locker_facility" className="text-sm cursor-pointer">
                                        Locker Facility
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
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
