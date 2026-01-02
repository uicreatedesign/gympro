import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { PageProps, Equipment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search } from 'lucide-react';
import EquipmentTable from '@/components/equipment/equipment-table';
import EquipmentModal from '@/components/equipment/equipment-modal';
import ViewEquipmentModal from '@/components/equipment/view-equipment-modal';
import DeleteEquipmentDialog from '@/components/equipment/delete-equipment-dialog';

interface Props extends PageProps {
    equipment: {
        data: Equipment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page: number;
    };
}

export default function Index({ equipment, filters }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editEquipment, setEditEquipment] = useState<Equipment | null>(null);
    const [viewEquipment, setViewEquipment] = useState<Equipment | null>(null);
    const [deleteEquipment, setDeleteEquipment] = useState<Equipment | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [debouncedSearch] = useDebounce(search, 500);

    const canEdit = auth.permissions.includes('edit_equipment');
    const canDelete = auth.permissions.includes('delete_equipment');

    useEffect(() => {
        router.get('/equipment', {
            search: debouncedSearch || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            per_page: filters.per_page
        }, { preserveState: true, preserveScroll: true, replace: true });
    }, [debouncedSearch, statusFilter]);

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter('all');
    };

    const handlePageChange = (page: number) => {
        router.get('/equipment', {
            page,
            search: search || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            per_page: filters.per_page
        }, { preserveState: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get('/equipment', {
            search: search || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            per_page: value
        }, { preserveState: true });
    };

    const startItem = (equipment.current_page - 1) * equipment.per_page + 1;
    const endItem = Math.min(equipment.current_page * equipment.per_page, equipment.total);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = equipment;
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
            <Head title="Equipment" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Equipment</h1>
                        <p className="text-muted-foreground">Manage gym equipment</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Equipment
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <EquipmentTable
                            equipment={equipment.data}
                            search={search}
                            statusFilter={statusFilter}
                            onSearchChange={setSearch}
                            onStatusChange={setStatusFilter}
                            onClearFilters={handleClearFilters}
                            onEdit={canEdit ? setEditEquipment : () => {}}
                            onDelete={canDelete ? setDeleteEquipment : () => {}}
                            onView={setViewEquipment}
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startItem} to {endItem} of {equipment.total} results
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
                                        <PaginationPrevious onClick={() => handlePageChange(equipment.current_page - 1)} className={equipment.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === equipment.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(equipment.current_page + 1)} className={equipment.current_page === equipment.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EquipmentModal open={createOpen} onOpenChange={setCreateOpen} />
            <EquipmentModal open={!!editEquipment} onOpenChange={(open) => !open && setEditEquipment(null)} equipment={editEquipment} />
            <ViewEquipmentModal open={!!viewEquipment} onOpenChange={(open) => !open && setViewEquipment(null)} equipment={viewEquipment} />
            <DeleteEquipmentDialog open={!!deleteEquipment} onOpenChange={(open) => !open && setDeleteEquipment(null)} equipment={deleteEquipment} />
        </AppLayout>
    );
}
