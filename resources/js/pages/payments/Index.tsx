import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Payment, Member, PageProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import PaymentTable from '@/components/payments/payment-table';
import CreatePaymentModal from '@/components/payments/create-payment-modal';
import EditPaymentModal from '@/components/payments/edit-payment-modal';
import DeletePaymentDialog from '@/components/payments/delete-payment-dialog';

interface PaginatedData {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props extends PageProps {
    payments: PaginatedData;
    subscriptions: any[];
    filters: { search: string | null; per_page: number };
}

export default function Index({ payments, subscriptions, filters }: Props) {
    const { auth } = usePage().props as any;
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [deletePayment, setDeletePayment] = useState<Payment | null>(null);

    const canCreate = auth.permissions.includes('create_payments');
    const canEdit = auth.permissions.includes('edit_payments');
    const canDelete = auth.permissions.includes('delete_payments');

    const handlePageChange = (page: number) => {
        router.get('/payments', { page }, { preserveState: true });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = payments;
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
                    <CardContent className="p-6">
                        <PaymentTable 
                            payments={payments.data}
                            onEdit={canEdit ? setEditPayment : undefined}
                            onDelete={canDelete ? setDeletePayment : undefined}
                        />
                        {payments.last_page > 1 && (
                            <div className="p-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious onClick={() => handlePageChange(payments.current_page - 1)} className={payments.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                        </PaginationItem>
                                        {getPageNumbers().map((page, idx) => (
                                            <PaginationItem key={idx}>
                                                {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === payments.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext onClick={() => handlePageChange(payments.current_page + 1)} className={payments.current_page === payments.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreatePaymentModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    subscriptions={subscriptions || []}
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
