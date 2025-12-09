import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plan } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan;
}

export default function DeletePlanDialog({ open, onOpenChange, plan }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/plans/${plan.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Plan deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete plan');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Plan</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
