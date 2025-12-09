import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Member } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: Member;
}

export default function DeleteMemberDialog({ open, onOpenChange, member }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/members/${member.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Member deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete member');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Member</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{member.name}"? This action cannot be undone.
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
