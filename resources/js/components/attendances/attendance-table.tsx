import { Attendance } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Pencil, Trash2 } from 'lucide-react';

interface Props {
    attendances: Attendance[];
    onCheckOut?: (attendance: Attendance) => void;
    onEdit?: (attendance: Attendance) => void;
    onDelete?: (attendance: Attendance) => void;
}

export default function AttendanceTable({ attendances, onCheckOut, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Check-out Time</TableHead>
                    <TableHead>Status</TableHead>
                    {(onCheckOut || onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {attendances.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={(onCheckOut || onEdit || onDelete) ? 5 : 4} className="text-center text-muted-foreground">
                            No attendance records for today
                        </TableCell>
                    </TableRow>
                ) : (
                    attendances.map((attendance) => (
                        <TableRow key={attendance.id}>
                            <TableCell className="font-medium">{attendance.member?.name}</TableCell>
                            <TableCell>{attendance.check_in_time}</TableCell>
                            <TableCell>{attendance.check_out_time || '-'}</TableCell>
                            <TableCell>
                                {attendance.check_out_time ? (
                                    <Badge variant="secondary">Checked Out</Badge>
                                ) : (
                                    <Badge className="bg-green-500">In Gym</Badge>
                                )}
                            </TableCell>
                            {(onCheckOut || onEdit || onDelete) && (
                                <TableCell className="text-right space-x-2">
                                    {onCheckOut && !attendance.check_out_time && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onCheckOut(attendance)}
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onEdit(attendance)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => onDelete(attendance)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
