import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateTrainerModal({ open, onOpenChange }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
        experience_years: 0,
        salary: '',
        joining_date: new Date().toISOString().split('T')[0],
        bio: '',
        status: 'active' as 'active' | 'inactive',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/trainers', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success('Trainer created successfully');
            },
            onError: () => {
                toast.error('Failed to create trainer');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Trainer</DialogTitle>
                    <DialogDescription>Create a new trainer profile</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                value={data.specialization}
                                onChange={(e) => setData('specialization', e.target.value)}
                                placeholder="e.g., Yoga, CrossFit, Cardio"
                            />
                            {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience_years">Experience (Years)</Label>
                            <Input
                                id="experience_years"
                                type="number"
                                value={data.experience_years}
                                onChange={(e) => setData('experience_years', parseInt(e.target.value))}
                            />
                            {errors.experience_years && <p className="text-sm text-destructive">{errors.experience_years}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={data.salary}
                                onChange={(e) => setData('salary', e.target.value)}
                            />
                            {errors.salary && <p className="text-sm text-destructive">{errors.salary}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="joining_date">Joining Date</Label>
                            <Input
                                id="joining_date"
                                type="date"
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                            />
                            {errors.joining_date && <p className="text-sm text-destructive">{errors.joining_date}</p>}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Brief description about the trainer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value: 'active' | 'inactive') => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
