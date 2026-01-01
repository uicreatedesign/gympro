import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Attendance, Member } from '@/types';
import AttendanceTable from '@/components/attendances/attendance-table';
import MonthlyAttendanceGrid from '@/components/attendances/monthly-attendance-grid';
import CheckInModal from '@/components/attendances/check-in-modal';
import CheckOutModal from '@/components/attendances/check-out-modal';
import EditAttendanceModal from '@/components/attendances/edit-attendance-modal';
import DeleteAttendanceDialog from '@/components/attendances/delete-attendance-dialog';
import { UserCheck, Users, Calendar } from 'lucide-react';

interface Props {
    attendances: Attendance[];
    members: Member[];
    stats: {
        today_count: number;
        checked_in: number;
    };
    selectedDate: string | null;
    selectedMonth: string | null;
    monthlyData: any[] | null;
    daysInMonth: number | null;
}

export default function Index({ attendances, members, stats, selectedDate, selectedMonth, monthlyData, daysInMonth }: Props) {
    const { auth } = usePage().props as any;
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [checkOutAttendance, setCheckOutAttendance] = useState<Attendance | null>(null);
    const [editAttendance, setEditAttendance] = useState<Attendance | null>(null);
    const [deleteAttendance, setDeleteAttendance] = useState<Attendance | null>(null);
    const [customDate, setCustomDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [customMonth, setCustomMonth] = useState(selectedMonth || new Date().toISOString().slice(0, 7));
    const [activeTab, setActiveTab] = useState(selectedMonth ? 'monthly' : selectedDate ? 'custom' : 'today');

    const canCreate = auth.permissions.includes('create_attendances');
    const canEdit = auth.permissions.includes('edit_attendances');
    const canDelete = auth.permissions.includes('delete_attendances');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'today') {
            router.get('/attendances', {}, { preserveState: true });
        }
    };

    const handleDateChange = () => {
        router.get('/attendances', { date: customDate }, { preserveState: true });
    };

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
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total members checked in</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Currently In Gym</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.checked_in}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active members in gym</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Records</CardTitle>
                        <CardDescription>View and manage member attendance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={handleTabChange}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="today">Today</TabsTrigger>
                                <TabsTrigger value="custom">Custom Date</TabsTrigger>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="today" className="space-y-4">
                                <AttendanceTable 
                                    attendances={attendances} 
                                    onCheckOut={canEdit ? setCheckOutAttendance : undefined}
                                    onEdit={canEdit ? setEditAttendance : undefined}
                                    onDelete={canDelete ? setDeleteAttendance : undefined}
                                />
                                {attendances.length === 0 && (
                                    <div className="text-center py-12">
                                        <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No attendance records</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">No members have checked in today</p>
                                    </div>
                                )}
                            </TabsContent>
                            
                            <TabsContent value="custom" className="space-y-4">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor="date">Select Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={customDate}
                                            onChange={(e) => {
                                                setCustomDate(e.target.value);
                                                router.get('/attendances', { date: e.target.value }, { preserveState: true });
                                            }}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <AttendanceTable 
                                    attendances={attendances} 
                                    onCheckOut={canEdit ? setCheckOutAttendance : undefined}
                                    onEdit={canEdit ? setEditAttendance : undefined}
                                    onDelete={canDelete ? setDeleteAttendance : undefined}
                                />
                                {attendances.length === 0 && (
                                    <div className="text-center py-12">
                                        <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">No attendance records</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">No members checked in on this date</p>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="monthly" className="space-y-4">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor="month">Select Month</Label>
                                        <Input
                                            id="month"
                                            type="month"
                                            value={customMonth}
                                            onChange={(e) => {
                                                setCustomMonth(e.target.value);
                                                router.get('/attendances', { month: e.target.value }, { preserveState: true });
                                            }}
                                            max={new Date().toISOString().slice(0, 7)}
                                        />
                                    </div>
                                </div>
                                {monthlyData && daysInMonth ? (
                                    <MonthlyAttendanceGrid data={monthlyData} daysInMonth={daysInMonth} />
                                ) : (
                                    <div className="text-center py-12">
                                        <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-semibold">Select a month</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">Choose a month to view attendance</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
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
