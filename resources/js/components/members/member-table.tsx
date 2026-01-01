import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface Props {
    members: Member[];
    onView?: (member: Member) => void;
    onEdit?: (member: Member) => void;
    onDelete?: (member: Member) => void;
}

const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    expired: 'bg-red-500',
};

export default function MemberTable({ members, onView, onEdit, onDelete }: Props) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16">Sr No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    {(onView || onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member, index) => (
                    <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage 
                                        src={member.user?.profile_image ? `/storage/${member.user.profile_image}` : undefined} 
                                        alt={member.user?.name} 
                                    />
                                    <AvatarFallback className="text-xs">
                                        {getInitials(member.user?.name || '')}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{member.user?.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{member.user?.email}</TableCell>
                        <TableCell>{member.user?.phone}</TableCell>
                        <TableCell className="capitalize">{member.gender}</TableCell>
                        <TableCell>{new Date(member.join_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline"
                                className={
                                    member.status === 'active'
                                        ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                        : member.status === 'expired'
                                        ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950'
                                        : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950'
                                }
                            >
                                {member.status}
                            </Badge>
                        </TableCell>
                        {(onView || onEdit || onDelete) && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <Button variant="outline" size="sm" onClick={() => onView(member)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button variant="outline" size="sm" onClick={() => onDelete(member)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
