import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types';
import MemberTable from '@/components/members/member-table';
import CreateMemberModal from '@/components/members/create-member-modal';
import EditMemberModal from '@/components/members/edit-member-modal';
import DeleteMemberDialog from '@/components/members/delete-member-dialog';

interface Props {
    members: Member[] | { data: Member[] };
}

export default function Index({ members }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [deleteMember, setDeleteMember] = useState<Member | null>(null);

    const canCreate = auth.permissions.includes('create_members');
    const canEdit = auth.permissions.includes('edit_members');
    const canDelete = auth.permissions.includes('delete_members');

    const memberData = Array.isArray(members) ? members : members.data;

    return (
        <AppLayout>
            <Head title="Members" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Members</h1>
                        <p className="text-muted-foreground">Manage gym members</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCreateOpen(true)}>Add Member</Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Members</CardTitle>
                        <CardDescription>View and manage member information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemberTable 
                            members={memberData} 
                            onEdit={canEdit ? setEditMember : undefined}
                            onDelete={canDelete ? setDeleteMember : undefined}
                        />
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CreateMemberModal 
                    open={createOpen} 
                    onOpenChange={setCreateOpen}
                />
            )}

            {canEdit && editMember && (
                <EditMemberModal 
                    open={!!editMember} 
                    onOpenChange={(open) => !open && setEditMember(null)}
                    member={editMember}
                />
            )}

            {canDelete && deleteMember && (
                <DeleteMemberDialog 
                    open={!!deleteMember} 
                    onOpenChange={(open) => !open && setDeleteMember(null)}
                    member={deleteMember}
                />
            )}
        </AppLayout>
    );
}
