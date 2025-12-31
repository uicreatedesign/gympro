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
                    <TableHead className="w-16">Sr No</TableHead>
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
                {trainers.map((trainer, index) => (
                    <TableRow key={trainer.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{trainer.user?.name}</TableCell>
                        <TableCell>{trainer.user?.email}</TableCell>
                        <TableCell>{trainer.specialization}</TableCell>
                        <TableCell>{trainer.experience_years} years</TableCell>
                        <TableCell>₹{trainer.salary}</TableCell>
                        <TableCell>{new Date(trainer.joining_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline"
                                className={
                                    trainer.status === 'active'
                                        ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                        : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950'
                                }
                            >
                                {trainer.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onEdit && (
                                        <Button variant="outline" size="sm" onClick={() => onEdit(trainer)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button variant="outline" size="sm" onClick={() => onDelete(trainer)}>
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
