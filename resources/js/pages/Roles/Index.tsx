import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission, Role } from '@/types';
import RoleTable from '@/components/roles/role-table';
import CreateRoleModal from '@/components/roles/create-role-modal';
import EditRoleModal from '@/components/roles/edit-role-modal';
import DeleteRoleDialog from '@/components/roles/delete-role-dialog';

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function Index({ roles, permissions }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);

    const canCreate = auth.permissions.includes('create_roles');
    const canEdit = auth.permissions.includes('edit_roles');
    const canDelete = auth.permissions.includes('delete_roles');

    return (
        <AppLayout>
            <Head title="Roles & Permissions" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
                        <p className="text-muted-foreground">Manage system roles and permissions</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCreateOpen(true)}>Create Role</Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Roles</CardTitle>
                        <CardDescription>Manage roles and their permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RoleTable 
                            roles={roles} 
                            onEdit={canEdit ? setEditRole : undefined}
                            onDelete={canDelete ? setDeleteRole : undefined}
                        />
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreateRoleModal 
                    open={createOpen} 
                    onOpenChange={setCreateOpen}
                    permissions={permissions}
                />
            )}

            {canEdit && editRole && (
                <EditRoleModal 
                    open={!!editRole} 
                    onOpenChange={(open) => !open && setEditRole(null)}
                    role={editRole}
                    permissions={permissions}
                />
            )}

            {canDelete && deleteRole && (
                <DeleteRoleDialog 
                    open={!!deleteRole} 
                    onOpenChange={(open) => !open && setDeleteRole(null)}
                    role={deleteRole}
                />
            )}
        </AppLayout>
    );
}
