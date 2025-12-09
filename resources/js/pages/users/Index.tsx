import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { User, Role, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, UserCheck, UserX, Plus } from 'lucide-react';
import UserTable from '@/components/users/user-table';
import CreateUserModal from '@/components/users/create-user-modal';

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
    const [createModalOpen, setCreateModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Users" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Users</h1>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
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

                <UserTable users={users} roles={roles} />
            </div>

            <CreateUserModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                roles={roles}
            />
        </AuthenticatedLayout>
    );
}
