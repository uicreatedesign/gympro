import { Plan } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan;
}

export default function ViewPlanModal({ open, onOpenChange, plan }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Plan Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <Badge 
                            variant="outline"
                            className={
                                plan.status === 'active'
                                    ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                    : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950'
                            }
                        >
                            {plan.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-lg font-semibold">{plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-lg font-semibold">₹{plan.price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Admission Fee</p>
                            <p className="text-lg font-semibold">₹{plan.admission_fee || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Shift</p>
                            <p className="text-lg font-semibold capitalize">{plan.shift}</p>
                        </div>
                    </div>

                    {plan.shift_time && (
                        <div>
                            <p className="text-sm text-muted-foreground">Shift Timing</p>
                            <p className="font-medium">{plan.shift_time}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Features</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {plan.personal_training ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                )}
                                <span className={plan.personal_training ? '' : 'text-muted-foreground'}>
                                    Personal Training
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {plan.group_classes ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                )}
                                <span className={plan.group_classes ? '' : 'text-muted-foreground'}>
                                    Group Classes
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {plan.locker_facility ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                )}
                                <span className={plan.locker_facility ? '' : 'text-muted-foreground'}>
                                    Locker Facility
                                </span>
                            </div>
                        </div>
                    </div>

                    {plan.description && (
                        <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="font-medium">{plan.description}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
