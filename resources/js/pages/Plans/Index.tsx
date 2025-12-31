import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan } from '@/types';
import PlanTable from '@/components/plans/plan-table';
import CreatePlanModal from '@/components/plans/create-plan-modal';
import EditPlanModal from '@/components/plans/edit-plan-modal';
import DeletePlanDialog from '@/components/plans/delete-plan-dialog';

interface Props {
    plans: Plan[] | { data: Plan[] };
}

export default function Index({ plans }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editPlan, setEditPlan] = useState<Plan | null>(null);
    const [deletePlan, setDeletePlan] = useState<Plan | null>(null);

    const canCreate = auth.permissions.includes('create_plans');
    const canEdit = auth.permissions.includes('edit_plans');
    const canDelete = auth.permissions.includes('delete_plans');

    const planData = Array.isArray(plans) ? plans : plans.data;

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
                    <CardContent>
                        <PlanTable 
                            plans={planData} 
                            onEdit={canEdit ? setEditPlan : undefined}
                            onDelete={canDelete ? setDeletePlan : undefined}
                        />
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
