import { Trainer } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
    trainers: Trainer[];
    onEdit?: (trainer: Trainer) => void;
    onDelete?: (trainer: Trainer) => void;
}

export default function TrainerTable({ trainers, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Status</TableHead>
                    {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                        <TableCell className="font-medium">{trainer.user?.name}</TableCell>
                        <TableCell>{trainer.user?.email}</TableCell>
                        <TableCell>{trainer.specialization}</TableCell>
                        <TableCell>{trainer.experience_years} years</TableCell>
                        <TableCell>₹{trainer.salary}</TableCell>
                        <TableCell>{new Date(trainer.joining_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge className={trainer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                                {trainer.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(trainer)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(trainer)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
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
