import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Trainer, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Plus } from 'lucide-react';
import TrainerTable from '@/components/trainers/trainer-table';
import CreateTrainerModal from '@/components/trainers/create-trainer-modal';
import EditTrainerModal from '@/components/trainers/edit-trainer-modal';
import DeleteTrainerDialog from '@/components/trainers/delete-trainer-dialog';

interface Props extends PageProps {
    trainers: Trainer[] | { data: Trainer[] };
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
}

export default function Index({ trainers, stats }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editTrainer, setEditTrainer] = useState<Trainer | null>(null);
    const [deleteTrainer, setDeleteTrainer] = useState<Trainer | null>(null);

    const canCreate = auth.permissions.includes('create_trainers');
    const canEdit = auth.permissions.includes('edit_trainers');
    const canDelete = auth.permissions.includes('delete_trainers');

    const trainerData = Array.isArray(trainers) ? trainers : trainers.data;

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
                    <CardContent className="pt-6">
                        <TrainerTable 
                            trainers={trainerData}
                            onEdit={canEdit ? setEditTrainer : undefined}
                            onDelete={canDelete ? setDeleteTrainer : undefined}
                        />
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
