import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    members: Member[];
    onEdit?: (member: Member) => void;
    onDelete?: (member: Member) => void;
}

const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    expired: 'bg-red-500',
};

export default function MemberTable({ members, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell className="capitalize">{member.gender}</TableCell>
                        <TableCell>{new Date(member.join_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge className={statusColors[member.status]}>
                                {member.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(member)}>
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
