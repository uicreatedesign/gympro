import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plan } from '@/types';
import PlanTable from '@/components/plans/plan-table';
import CreatePlanModal from '@/components/plans/create-plan-modal';
import EditPlanModal from '@/components/plans/edit-plan-modal';
import DeletePlanDialog from '@/components/plans/delete-plan-dialog';

interface PaginatedData {
    data: Plan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    plans: PaginatedData;
}

export default function Index({ plans }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editPlan, setEditPlan] = useState<Plan | null>(null);
    const [deletePlan, setDeletePlan] = useState<Plan | null>(null);

    const canCreate = auth.permissions.includes('create_plans');
    const canEdit = auth.permissions.includes('edit_plans');
    const canDelete = auth.permissions.includes('delete_plans');

    const handlePageChange = (page: number) => {
        router.get('/plans', { page }, { preserveState: true });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = plans;
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
            <Head title="Membership Plans" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Membership Plans</h1>
                        <p className="text-muted-foreground">Manage gym membership plans</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCreateOpen(true)}>Add Plan</Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Plans</CardTitle>
                        <CardDescription>View and manage membership plans</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PlanTable 
                            plans={plans.data} 
                            onEdit={canEdit ? setEditPlan : undefined}
                            onDelete={canDelete ? setDeletePlan : undefined}
                        />
                        {plans.last_page > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(plans.current_page - 1)} className={plans.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === plans.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(plans.current_page + 1)} className={plans.current_page === plans.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreatePlanModal 
                    open={createOpen} 
                    onOpenChange={setCreateOpen}
                />
            )}

            {canEdit && editPlan && (
                <EditPlanModal 
                    open={!!editPlan} 
                    onOpenChange={(open) => !open && setEditPlan(null)}
                    plan={editPlan}
                />
            )}

            {canDelete && deletePlan && (
                <DeletePlanDialog 
                    open={!!deletePlan} 
                    onOpenChange={(open) => !open && setDeletePlan(null)}
                    plan={deletePlan}
                />
            )}
        </AppLayout>
    );
}
