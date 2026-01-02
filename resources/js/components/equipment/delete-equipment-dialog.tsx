import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
}

export default function DeleteEquipmentDialog({ open, onOpenChange, equipment }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!equipment) return;
        
        destroy(`/equipment/${equipment.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Equipment deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete equipment');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Equipment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{equipment?.name}"? This action cannot be undone.
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
