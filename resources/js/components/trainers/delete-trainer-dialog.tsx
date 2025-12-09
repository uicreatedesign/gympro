import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trainer } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trainer: Trainer;
}

export default function DeleteTrainerDialog({ open, onOpenChange, trainer }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/trainers/${trainer.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Trainer deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete trainer');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Trainer</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{trainer.user?.name}"? This action cannot be undone.
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
