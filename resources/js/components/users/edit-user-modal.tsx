import { FormEventHandler, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Role } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    roles: Role[];
}

export default function EditUserModal({ open, onOpenChange, user, roles }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        user.profile_image ? `/storage/${user.profile_image}` : null
    );
    
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        profile_image: null as File | null,
        status: user.status || 'active',
        roles: user.roles?.map(r => r.id) || [],
        _method: 'PUT',
    });

    useEffect(() => {
        setData({
            name: user.name,
            email: user.email,
            password: '',
            profile_image: null,
            status: user.status || 'active',
            roles: user.roles?.map(r => r.id) || [],
            _method: 'PUT',
        });
        setImagePreview(user.profile_image ? `/storage/${user.profile_image}` : null);
    }, [user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/users/${user.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('User updated successfully');
            },
            onError: () => {
                toast.error('Failed to update user');
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
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Update user details</DialogDescription>
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
                            <Label htmlFor="password">Password (leave blank to keep current)</Label>
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
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
