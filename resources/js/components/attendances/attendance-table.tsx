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
                        <TableRow key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                            <TableCell className="font-medium">{attendance.member?.name}</TableCell>
                            <TableCell>{attendance.check_in_time}</TableCell>
                            <TableCell>{attendance.check_out_time || '-'}</TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {attendance.check_out_time ? 'Checked Out' : 'In Gym'}
                                </Badge>
                            </TableCell>
                            {(onCheckOut || onEdit || onDelete) && (
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {onCheckOut && !attendance.check_out_time && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => onCheckOut(attendance)}
                                            >
                                                <LogOut className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {onEdit && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => onEdit(attendance)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => onDelete(attendance)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
