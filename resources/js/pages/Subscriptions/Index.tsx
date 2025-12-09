import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Subscription, Member, Plan } from '@/types';
import SubscriptionTable from '@/components/subscriptions/subscription-table';
import CreateSubscriptionModal from '@/components/subscriptions/create-subscription-modal';
import EditSubscriptionModal from '@/components/subscriptions/edit-subscription-modal';
import DeleteSubscriptionDialog from '@/components/subscriptions/delete-subscription-dialog';

interface Props {
    subscriptions: Subscription[];
    members: Member[];
    plans: Plan[];
}

export default function Index({ subscriptions, members, plans }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
    const [deleteSubscription, setDeleteSubscription] = useState<Subscription | null>(null);

    const canCreate = auth.permissions.includes('create_subscriptions');
    const canEdit = auth.permissions.includes('edit_subscriptions');
    const canDelete = auth.permissions.includes('delete_subscriptions');

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
                    <CardHeader>
                        <CardTitle>All Subscriptions</CardTitle>
                        <CardDescription>View and manage member subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubscriptionTable 
                            subscriptions={subscriptions} 
                            onEdit={canEdit ? setEditSubscription : undefined}
                            onDelete={canDelete ? setDeleteSubscription : undefined}
                        />
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
