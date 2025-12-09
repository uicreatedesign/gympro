import { Attendance } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => onCheckOut(attendance)}
                                        >
                                            Check Out
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => onEdit(attendance)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            onClick={() => onDelete(attendance)}
                                        >
                                            Delete
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
