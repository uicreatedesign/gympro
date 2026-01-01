import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MonthlyAttendanceData {
    member: {
        id: number;
        user?: {
            name: string;
            profile_image?: string;
        };
    };
    dates: Record<number, 'present' | 'absent'>;
    total_present: number;
}

interface Props {
    data: MonthlyAttendanceData[];
    daysInMonth: number;
}

export default function MonthlyAttendanceGrid({ data, daysInMonth }: Props) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Member</TableHead>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                            <TableHead key={day} className="text-center w-10">{day}</TableHead>
                        ))}
                        <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.member.id}>
                            <TableCell className="sticky left-0 bg-background z-10">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage 
                                            src={row.member.user?.profile_image ? `/storage/${row.member.user.profile_image}` : undefined} 
                                            alt={row.member.user?.name} 
                                        />
                                        <AvatarFallback className="text-xs">
                                            {getInitials(row.member.user?.name || '')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{row.member.user?.name}</span>
                                </div>
                            </TableCell>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                                <TableCell key={day} className="text-center p-1">
                                    {row.dates[day] === 'present' ? (
                                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950 w-6 h-6 p-0 flex items-center justify-center">
                                            P
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950 w-6 h-6 p-0 flex items-center justify-center">
                                            A
                                        </Badge>
                                    )}
                                </TableCell>
                            ))}
                            <TableCell className="text-center font-semibold">{row.total_present}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
