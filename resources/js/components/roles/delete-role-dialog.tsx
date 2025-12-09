import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Role } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role;
}

export default function DeleteRoleDialog({ open, onOpenChange, role }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/roles/${role.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Role deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete role');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Role</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the role "{role.name}"? This action cannot be undone.
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
