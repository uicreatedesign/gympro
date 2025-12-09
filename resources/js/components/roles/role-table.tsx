import { Role } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
    roles: Role[];
    onEdit?: (role: Role) => void;
    onDelete?: (role: Role) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {roles.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || '-'}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 3).map((permission) => (
                                    <Badge key={permission.id} variant="secondary">
                                        {permission.name}
                                    </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                    <Badge variant="outline">+{role.permissions.length - 3} more</Badge>
                                )}
                            </div>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(role)}>
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
