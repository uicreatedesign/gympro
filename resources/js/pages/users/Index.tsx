import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { User, Role, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { Users as UsersIcon, UserCheck, UserX, Plus, Search, X } from 'lucide-react';
import UserTable from '@/components/users/user-table';
import CreateUserModal from '@/components/users/create-user-modal';
import EditUserModal from '@/components/users/edit-user-modal';
import DeleteUserDialog from '@/components/users/delete-user-dialog';

interface PaginatedData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface Props extends PageProps {
    users: PaginatedData;
    roles: Role[];
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    filters: { 
        search: string | null;
        role: number | null;
        per_page: number;
    };
}

export default function Index({ users, roles, stats, filters }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role?.toString() || 'all');
    const [debouncedSearch] = useDebounce(search, 500);

    const canCreate = auth.permissions.includes('create_users');
    const canEdit = auth.permissions.includes('edit_users');
    const canDelete = auth.permissions.includes('delete_users');

    useEffect(() => {
        router.get('/users', { 
            search: debouncedSearch || undefined, 
            role: roleFilter !== 'all' ? roleFilter : undefined,
            per_page: filters.per_page 
        }, { preserveState: true, preserveScroll: true });
    }, [debouncedSearch, roleFilter]);

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('all');
    };

    const handlePageChange = (page: number) => {
        router.get('/users', { 
            page, 
            search: search || undefined,
            role: roleFilter !== 'all' ? roleFilter : undefined,
            per_page: filters.per_page 
        }, { preserveState: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get('/users', { 
            search: search || undefined,
            role: roleFilter !== 'all' ? roleFilter : undefined,
            per_page: value 
        }, { preserveState: true });
    };

    const startItem = (users.current_page - 1) * users.per_page + 1;
    const endItem = Math.min(users.current_page * users.per_page, users.total);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = users;
        if (last_page <= 7) return Array.from({ length: last_page }, (_, i) => i + 1);
        pages.push(1);
        if (current_page > 3) pages.push('...');
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i);
        if (current_page < last_page - 2) pages.push('...');
        pages.push(last_page);
        return pages;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-end gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8 h-9"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-40 h-9">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {(search || roleFilter !== 'all') && (
                                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <UserTable 
                            users={users.data} 
                            roles={roles}
                            onEdit={canEdit ? setEditUser : undefined}
                            onDelete={canDelete ? setDeleteUser : undefined}
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startItem} to {endItem} of {users.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Rows per page</span>
                                    <Select value={filters.per_page.toString()} onValueChange={handlePerPageChange}>
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(users.current_page - 1)} className={users.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === users.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(users.current_page + 1)} className={users.current_page === users.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
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
