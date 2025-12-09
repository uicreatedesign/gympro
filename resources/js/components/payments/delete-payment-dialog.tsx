import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Payment } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment: Payment;
}

export default function DeletePaymentDialog({ open, onOpenChange, payment }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/payments/${payment.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Payment deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete payment');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Payment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete payment "{payment.invoice_number}"? This action cannot be undone.
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
