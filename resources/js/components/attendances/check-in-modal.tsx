import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: Member[];
}

export default function CheckInModal({ open, onOpenChange, members }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in_time: new Date().toTimeString().slice(0, 5),
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/attendances', {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                toast.success('Member checked in successfully');
            },
            onError: () => {
                toast.error('Failed to check in member');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Check In Member</DialogTitle>
                    <DialogDescription>Record member check-in</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="member_id">Member *</Label>
                            <Select value={data.member_id} onValueChange={(value) => setData('member_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((member) => (
                                        <SelectItem key={member.id} value={member.id.toString()}>
                                            {member.user?.name || 'Unknown'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.member_id && <p className="text-sm text-destructive">{errors.member_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="check_in_time">Check-in Time *</Label>
                            <Input
                                id="check_in_time"
                                type="time"
                                value={data.check_in_time}
                                onChange={(e) => setData('check_in_time', e.target.value)}
                            />
                            {errors.check_in_time && <p className="text-sm text-destructive">{errors.check_in_time}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Optional notes"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Check In
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
