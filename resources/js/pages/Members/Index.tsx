import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Member } from '@/types';
import MemberTable from '@/components/members/member-table';
import CreateMemberModal from '@/components/members/create-member-modal';
import EditMemberModal from '@/components/members/edit-member-modal';
import DeleteMemberDialog from '@/components/members/delete-member-dialog';

interface PaginatedData {
    data: Member[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    members: PaginatedData;
}

export default function Index({ members }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [deleteMember, setDeleteMember] = useState<Member | null>(null);

    const canCreate = auth.permissions.includes('create_members');
    const canEdit = auth.permissions.includes('edit_members');
    const canDelete = auth.permissions.includes('delete_members');

    const handlePageChange = (page: number) => {
        router.get('/members', { page }, { preserveState: true });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = members;
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
                    <CardContent className="space-y-4">
                        <MemberTable 
                            members={members.data} 
                            onEdit={canEdit ? setEditMember : undefined}
                            onDelete={canDelete ? setDeleteMember : undefined}
                        />
                        {members.last_page > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(members.current_page - 1)} className={members.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === members.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(members.current_page + 1)} className={members.current_page === members.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
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
