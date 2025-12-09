import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { User, Role, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, UserCheck, UserX, Plus } from 'lucide-react';
import UserTable from '@/components/users/user-table';
import CreateUserModal from '@/components/users/create-user-modal';
import EditUserModal from '@/components/users/edit-user-modal';
import DeleteUserDialog from '@/components/users/delete-user-dialog';

interface Props extends PageProps {
    users: User[];
    roles: Role[];
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
}

export default function Index({ users, roles, stats }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const canCreate = auth.permissions.includes('create_users');
    const canEdit = auth.permissions.includes('edit_users');
    const canDelete = auth.permissions.includes('delete_users');

    return (
        <AppLayout>
            <Head title="Users" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Users</h1>
                    {canCreate && (
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.inactive}</div>
                        </CardContent>
                    </Card>
                </div>

                <UserTable 
                    users={users} 
                    roles={roles}
                    onEdit={canEdit ? setEditUser : undefined}
                    onDelete={canDelete ? setDeleteUser : undefined}
                />
            </div>

            {canCreate && (
                <CreateUserModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    roles={roles}
                />
            )}

            {canEdit && editUser && (
                <EditUserModal
                    open={!!editUser}
                    onOpenChange={(open) => !open && setEditUser(null)}
                    user={editUser}
                    roles={roles}
                />
            )}

            {canDelete && deleteUser && (
                <DeleteUserDialog
                    open={!!deleteUser}
                    onOpenChange={(open) => !open && setDeleteUser(null)}
                    user={deleteUser}
                />
            )}
        </AppLayout>
    );
}
