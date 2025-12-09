import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Attendance } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attendance: Attendance;
}

export default function DeleteAttendanceDialog({ open, onOpenChange, attendance }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/attendances/${attendance.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Attendance deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete attendance');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Attendance</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete attendance record for {attendance.member?.name}? This action cannot be undone.
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
