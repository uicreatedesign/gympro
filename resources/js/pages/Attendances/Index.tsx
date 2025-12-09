import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Attendance, Member } from '@/types';
import AttendanceTable from '@/components/attendances/attendance-table';
import CheckInModal from '@/components/attendances/check-in-modal';
import CheckOutModal from '@/components/attendances/check-out-modal';
import EditAttendanceModal from '@/components/attendances/edit-attendance-modal';
import DeleteAttendanceDialog from '@/components/attendances/delete-attendance-dialog';
import { UserCheck, Users } from 'lucide-react';

interface Props {
    attendances: Attendance[];
    members: Member[];
    stats: {
        today_count: number;
        checked_in: number;
    };
}

export default function Index({ attendances, members, stats }: Props) {
    const { auth } = usePage().props as any;
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [checkOutAttendance, setCheckOutAttendance] = useState<Attendance | null>(null);
    const [editAttendance, setEditAttendance] = useState<Attendance | null>(null);
    const [deleteAttendance, setDeleteAttendance] = useState<Attendance | null>(null);

    const canCreate = auth.permissions.includes('create_attendances');
    const canEdit = auth.permissions.includes('edit_attendances');
    const canDelete = auth.permissions.includes('delete_attendances');

    return (
        <AppLayout>
            <Head title="Attendance" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Attendance</h1>
                        <p className="text-muted-foreground">Track member check-ins and check-outs</p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => setCheckInOpen(true)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Check In
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Today's Check-ins</p>
                                    <p className="text-3xl font-bold mt-2">{stats.today_count}</p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-500">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Currently In Gym</p>
                                    <p className="text-3xl font-bold mt-2">{stats.checked_in}</p>
                                </div>
                                <div className="p-3 rounded-full bg-green-500">
                                    <UserCheck className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>Members who checked in today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AttendanceTable 
                            attendances={attendances} 
                            onCheckOut={canEdit ? setCheckOutAttendance : undefined}
                            onEdit={canEdit ? setEditAttendance : undefined}
                            onDelete={canDelete ? setDeleteAttendance : undefined}
                        />
                    </CardContent>
                </Card>
            </div>

            {canCreate && (
                <CheckInModal 
                    open={checkInOpen} 
                    onOpenChange={setCheckInOpen}
                    members={members}
                />
            )}

            {canEdit && checkOutAttendance && (
                <CheckOutModal 
                    open={!!checkOutAttendance} 
                    onOpenChange={(open) => !open && setCheckOutAttendance(null)}
                    attendance={checkOutAttendance}
                />
            )}

            {canEdit && editAttendance && (
                <EditAttendanceModal 
                    open={!!editAttendance} 
                    onOpenChange={(open) => !open && setEditAttendance(null)}
                    attendance={editAttendance}
                    members={members}
                />
            )}

            {canDelete && deleteAttendance && (
                <DeleteAttendanceDialog 
                    open={!!deleteAttendance} 
                    onOpenChange={(open) => !open && setDeleteAttendance(null)}
                    attendance={deleteAttendance}
                />
            )}
        </AppLayout>
    );
}
