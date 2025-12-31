import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Payment, Member, PageProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentTable from '@/components/payments/payment-table';
import CreatePaymentModal from '@/components/payments/create-payment-modal';
import EditPaymentModal from '@/components/payments/edit-payment-modal';
import DeletePaymentDialog from '@/components/payments/delete-payment-dialog';

interface Props extends PageProps {
    payments: Payment[] | { data: Payment[] };
    members: Member[];
}

export default function Index({ payments, members }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [deletePayment, setDeletePayment] = useState<Payment | null>(null);

    const canCreate = auth.permissions.includes('create_payments');
    const canEdit = auth.permissions.includes('edit_payments');
    const canDelete = auth.permissions.includes('delete_payments');

    const paymentData = Array.isArray(payments) ? payments : payments.data;

    return (
        <AppLayout>
            <Head title="Payments" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Payments</h1>
                        <p className="text-muted-foreground">Manage payment records</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCreateModalOpen(true)}>Record Payment</Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        <PaymentTable 
                            payments={paymentData}
                            onEdit={canEdit ? setEditPayment : undefined}
                            onDelete={canDelete ? setDeletePayment : undefined}
                        />
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreatePaymentModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    members={members}
                />
            )}

            {canEdit && editPayment && (
                <EditPaymentModal
                    open={!!editPayment}
                    onOpenChange={(open) => !open && setEditPayment(null)}
                    payment={editPayment}
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
