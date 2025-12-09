import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Payment, Member, Subscription, PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock, TrendingUp, Plus } from 'lucide-react';
import PaymentTable from '@/components/payments/payment-table';
import CreatePaymentModal from '@/components/payments/create-payment-modal';
import EditPaymentModal from '@/components/payments/edit-payment-modal';
import DeletePaymentDialog from '@/components/payments/delete-payment-dialog';

interface Props extends PageProps {
    payments: Payment[];
    members: Member[];
    subscriptions: Subscription[];
    stats: {
        total_revenue: number;
        pending_payments: number;
        completed_today: number;
    };
}

export default function Index({ payments, members, subscriptions, stats }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [deletePayment, setDeletePayment] = useState<Payment | null>(null);

    const canCreate = auth.permissions.includes('create_payments');
    const canEdit = auth.permissions.includes('edit_payments');
    const canDelete = auth.permissions.includes('delete_payments');

    const handleDownloadInvoice = (payment: Payment) => {
        window.open(`/payments/${payment.id}/invoice`, '_blank');
    };

    return (
        <AppLayout>
            <Head title="Payments" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Payments</h1>
                    {canCreate && (
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Record Payment
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.total_revenue}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_payments}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.completed_today}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <PaymentTable 
                            payments={payments}
                            onEdit={canEdit ? setEditPayment : undefined}
                            onDelete={canDelete ? setDeletePayment : undefined}
                            onDownloadInvoice={handleDownloadInvoice}
                        />
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreatePaymentModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    members={members}
                    subscriptions={subscriptions}
                />
            )}

            {canEdit && editPayment && (
                <EditPaymentModal
                    open={!!editPayment}
                    onOpenChange={(open) => !open && setEditPayment(null)}
                    payment={editPayment}
                    members={members}
                    subscriptions={subscriptions}
                />
            )}

            {canDelete && deletePayment && (
                <DeletePaymentDialog
                    open={!!deletePayment}
                    onOpenChange={(open) => !open && setDeletePayment(null)}
                    payment={deletePayment}
                />
            )}
        </AppLayout>
    );
}
