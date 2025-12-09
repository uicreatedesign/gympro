import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateMemberModal({ open, onOpenChange }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        gender: 'male' as 'male' | 'female' | 'other',
        date_of_birth: '',
        address: '',
        join_date: new Date().toISOString().split('T')[0],
        status: 'active' as 'active' | 'inactive' | 'expired',
        notes: '',
        create_login: false,
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/members', {
            onSuccess: () => {
                reset();
                onOpenChange(false);
                toast.success('Member created successfully');
            },
            onError: () => {
                toast.error('Failed to create member');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Fill in the member details</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select value={data.gender} onValueChange={(value: any) => setData('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth *</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                            {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="join_date">Join Date *</Label>
                            <Input
                                id="join_date"
                                type="date"
                                value={data.join_date}
                                onChange={(e) => setData('join_date', e.target.value)}
                            />
                            {errors.join_date && <p className="text-sm text-destructive">{errors.join_date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="create_login"
                                    checked={data.create_login}
                                    onCheckedChange={(checked) => setData('create_login', checked as boolean)}
                                />
                                <Label htmlFor="create_login" className="cursor-pointer">
                                    Create login account for this member
                                </Label>
                            </div>
                        </div>

                        {data.create_login && (
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter password for member login"
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
