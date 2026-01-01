import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Subscription, Member, Plan, Auth } from '@/types';
import SubscriptionTable from '@/components/subscriptions/subscription-table';
import CreateSubscriptionModal from '@/components/subscriptions/create-subscription-modal';
import EditSubscriptionModal from '@/components/subscriptions/edit-subscription-modal';
import DeleteSubscriptionDialog from '@/components/subscriptions/delete-subscription-dialog';
import { useDebouncedCallback } from 'use-debounce';

interface PaginatedData {
    data: Subscription[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    subscriptions: PaginatedData;
    members: Member[];
    plans: Plan[];
    filters: { search: string; per_page: number };
    auth: Auth;
}

export default function Index({ subscriptions, members, plans, filters, auth }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
    const [deleteSubscription, setDeleteSubscription] = useState<Subscription | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const canCreate = auth.permissions.includes('create_subscriptions');
    const canEdit = auth.permissions.includes('edit_subscriptions');
    const canDelete = auth.permissions.includes('delete_subscriptions');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/subscriptions', { search: value, per_page: filters.per_page }, { preserveState: true });
    }, 300);

    const handleSearch = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handlePerPageChange = (value: string) => {
        router.get('/subscriptions', { search, per_page: value }, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/subscriptions', { search, per_page: filters.per_page, page }, { preserveState: true });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = subscriptions;
        
        if (last_page <= 7) {
            return Array.from({ length: last_page }, (_, i) => i + 1);
        }
        
        pages.push(1);
        
        if (current_page > 3) pages.push('...');
        
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
            pages.push(i);
        }
        
        if (current_page < last_page - 2) pages.push('...');
        
        pages.push(last_page);
        
        return pages;
    };

    const startItem = (subscriptions.current_page - 1) * subscriptions.per_page + 1;
    const endItem = Math.min(subscriptions.current_page * subscriptions.per_page, subscriptions.total);

    return (
        <AppLayout>
            <Head title="Subscriptions" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Subscriptions</h1>
                        <p className="text-muted-foreground">Manage member subscriptions</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCreateOpen(true)}>Add Subscription</Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between gap-4">
                            <Select value={filters.per_page.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Search by member or plan..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>

                        <SubscriptionTable 
                            subscriptions={subscriptions.data} 
                            onEdit={canEdit ? setEditSubscription : undefined}
                            onDelete={canDelete ? setDeleteSubscription : undefined}
                        />

                        {subscriptions.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startItem}-{endItem} of {subscriptions.total} results
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => handlePageChange(subscriptions.current_page - 1)}
                                                className={subscriptions.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                        {getPageNumbers().map((page, idx) => (
                                            <PaginationItem key={idx}>
                                                {page === '...' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(page as number)}
                                                        isActive={page === subscriptions.current_page}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => handlePageChange(subscriptions.current_page + 1)}
                                                className={subscriptions.current_page === subscriptions.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreateSubscriptionModal 
                    open={createOpen} 
                    onOpenChange={setCreateOpen}
                    members={members}
                    plans={plans}
                />
            )}

            {canEdit && editSubscription && (
                <EditSubscriptionModal 
                    open={!!editSubscription} 
                    onOpenChange={(open) => !open && setEditSubscription(null)}
                    subscription={editSubscription}
                    members={members}
                    plans={plans}
                />
            )}

            {canDelete && deleteSubscription && (
                <DeleteSubscriptionDialog 
                    open={!!deleteSubscription} 
                    onOpenChange={(open) => !open && setDeleteSubscription(null)}
                    subscription={deleteSubscription}
                />
            )}
        </AppLayout>
    );
}
