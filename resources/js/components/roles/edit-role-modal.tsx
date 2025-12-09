import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, Role } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role;
    permissions: Permission[];
}

export default function EditRoleModal({ open, onOpenChange, role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.id),
    });

    useEffect(() => {
        setData({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions.map(p => p.id),
        });
    }, [role]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/roles/${role.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Role updated successfully');
            },
            onError: () => {
                toast.error('Failed to update role');
            },
        });
    };

    const togglePermission = (permissionId: number) => {
        setData('permissions', data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>Update role details and permissions</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
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
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={data.permissions.includes(permission.id)}
                                            onCheckedChange={() => togglePermission(permission.id)}
                                        />
                                        <label
                                            htmlFor={`permission-${permission.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {permission.name}
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
