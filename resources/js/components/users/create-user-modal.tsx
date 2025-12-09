import { FormEventHandler, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Role } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: Role[];
}

export default function CreateUserModal({ open, onOpenChange, roles }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        profile_image: null as File | null,
        status: 'active' as 'active' | 'inactive',
        roles: [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/users', {
            onSuccess: () => {
                reset();
                setImagePreview(null);
                onOpenChange(false);
                toast.success('User created successfully');
            },
            onError: () => {
                toast.error('Failed to create user');
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleRole = (roleId: number) => {
        setData('roles', data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="profile_image">Profile Image</Label>
                            <Input
                                id="profile_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
                            )}
                        </div>

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
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
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
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label>Roles</Label>
                            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.id)}
                                            onCheckedChange={() => toggleRole(role.id)}
                                        />
                                        <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer">
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
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
