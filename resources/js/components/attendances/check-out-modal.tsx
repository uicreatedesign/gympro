import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Attendance } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attendance: Attendance;
}

export default function CheckOutModal({ open, onOpenChange, attendance }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        check_out_time: new Date().toTimeString().slice(0, 5),
        notes: attendance.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/attendances/${attendance.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Member checked out successfully');
            },
            onError: () => {
                toast.error('Failed to check out member');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Check Out Member</DialogTitle>
                    <DialogDescription>
                        Check out {attendance.member?.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Check-in Time</Label>
                            <Input value={attendance.check_in_time} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="check_out_time">Check-out Time *</Label>
                            <Input
                                id="check_out_time"
                                type="time"
                                value={data.check_out_time}
                                onChange={(e) => setData('check_out_time', e.target.value)}
                            />
                            {errors.check_out_time && <p className="text-sm text-destructive">{errors.check_out_time}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Check Out
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
