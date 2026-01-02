import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Trainer, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Plus, Search } from 'lucide-react';
import TrainerTable from '@/components/trainers/trainer-table';
import CreateTrainerModal from '@/components/trainers/create-trainer-modal';
import EditTrainerModal from '@/components/trainers/edit-trainer-modal';
import DeleteTrainerDialog from '@/components/trainers/delete-trainer-dialog';

interface PaginatedData {
    data: Trainer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props extends PageProps {
    trainers: PaginatedData;
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    filters: { 
        per_page: number;
        search: string | null;
        status: string | null;
    };
}

export default function Index({ trainers, stats, filters }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editTrainer, setEditTrainer] = useState<Trainer | null>(null);
    const [deleteTrainer, setDeleteTrainer] = useState<Trainer | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const canCreate = auth.permissions.includes('create_trainers');
    const canEdit = auth.permissions.includes('edit_trainers');
    const canDelete = auth.permissions.includes('delete_trainers');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/trainers', { 
                search: search || undefined, 
                status: status !== 'all' ? status : undefined,
                per_page: filters.per_page 
            }, { preserveState: true, preserveScroll: true, replace: true });
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/trainers', { 
            search: search || undefined, 
            status: value !== 'all' ? value : undefined,
            per_page: filters.per_page 
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.post('/trainers/filter', { 
            page, 
            per_page: filters.per_page,
            search: search || undefined,
            status: status !== 'all' ? status : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        router.post('/trainers/filter', { 
            per_page: value,
            search: search || undefined,
            status: status !== 'all' ? status : undefined
        }, { preserveState: true });
    };

    const startItem = (trainers.current_page - 1) * trainers.per_page + 1;
    const endItem = Math.min(trainers.current_page * trainers.per_page, trainers.total);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = trainers;
        if (last_page <= 7) return Array.from({ length: last_page }, (_, i) => i + 1);
        pages.push(1);
        if (current_page > 3) pages.push('...');
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i);
        if (current_page < last_page - 2) pages.push('...');
        pages.push(last_page);
        return pages;
    };

    return (
        <AppLayout>
            <Head title="Trainers" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Trainers</h1>
                    {canCreate && (
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Trainer
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Trainers</CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.inactive}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or specialization..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <TrainerTable 
                            trainers={trainers.data}
                            onEdit={canEdit ? setEditTrainer : undefined}
                            onDelete={canDelete ? setDeleteTrainer : undefined}
                        />
                        {trainers.data.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No trainers found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {search || status !== 'all' ? 'Try adjusting your filters' : 'Get started by adding a new trainer'}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm text-muted-foreground hidden">
                                    Showing {startItem} to {endItem} of {trainers.total} results
                                </div>
                                <div className="flex items-center">
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
                                        <PaginationPrevious onClick={() => handlePageChange(trainers.current_page - 1)} className={trainers.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === trainers.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(trainers.current_page + 1)} className={trainers.current_page === trainers.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreateTrainerModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />
            )}

            {canEdit && editTrainer && (
                <EditTrainerModal
                    open={!!editTrainer}
                    onOpenChange={(open) => !open && setEditTrainer(null)}
                    trainer={editTrainer}
                />
            )}

            {canDelete && deleteTrainer && (
                <DeleteTrainerDialog
                    open={!!deleteTrainer}
                    onOpenChange={(open) => !open && setDeleteTrainer(null)}
                    trainer={deleteTrainer}
                />
            )}
        </AppLayout>
    );
}
