import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: Expense | null;
}

export default function DeleteExpenseDialog({ open, onOpenChange, expense }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!expense) return;
        
        destroy(`/expenses/${expense.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Expense deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete expense');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Expense</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{expense?.title}"? This action cannot be undone.
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
