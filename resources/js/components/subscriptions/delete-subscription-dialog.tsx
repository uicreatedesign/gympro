import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Subscription } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription: Subscription;
}

export default function DeleteSubscriptionDialog({ open, onOpenChange, subscription }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/subscriptions/${subscription.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Subscription deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete subscription');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Subscription</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this subscription? This action cannot be undone.
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
