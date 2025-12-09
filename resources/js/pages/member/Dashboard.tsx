import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Member, Subscription, Payment, Attendance, PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, TrendingUp, Download, User } from 'lucide-react';

interface Props extends PageProps {
    member: Member;
    currentSubscription: Subscription | null;
    daysRemaining: number;
    subscriptionStatus: 'active' | 'expiring' | 'expired' | 'none';
    attendanceThisMonth: number;
    lastCheckIn: Attendance | null;
    recentPayments: Payment[];
}

export default function Dashboard({ member, currentSubscription, daysRemaining, subscriptionStatus, attendanceThisMonth, lastCheckIn, recentPayments }: Props) {
    const statusColors = {
        active: 'bg-green-500',
        expiring: 'bg-yellow-500',
        expired: 'bg-red-500',
        none: 'bg-gray-500',
    };

    const statusLabels = {
        active: 'Active',
        expiring: 'Expiring Soon',
        expired: 'Expired',
        none: 'No Active Plan',
    };

    return (
        <AppLayout>
            <Head title="My Dashboard" />
            <div className="container mx-auto p-6 space-y-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {member.name}!</h1>
                        <p className="text-muted-foreground">Here's your fitness journey overview</p>
                    </div>
                </div>

                {/* Membership Status Card */}
                <Card className="border-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">Membership Status</CardTitle>
                                <CardDescription>Your current subscription details</CardDescription>
                            </div>
                            <Badge className={statusColors[subscriptionStatus]}>
                                {statusLabels[subscriptionStatus]}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {currentSubscription ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Plan</p>
                                        <p className="text-lg font-semibold">{currentSubscription.plan?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Days Remaining</p>
                                        <p className="text-lg font-semibold">
                                            {subscriptionStatus === 'expired' ? 'Expired' : `${daysRemaining} days`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="text-lg font-semibold">
                                            {new Date(currentSubscription.start_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">End Date</p>
                                        <p className="text-lg font-semibold">
                                            {new Date(currentSubscription.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {(subscriptionStatus === 'expiring' || subscriptionStatus === 'expired') && (
                                    <Button className="w-full">Renew Membership</Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">You don't have an active subscription</p>
                                <Button>Contact Admin</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Attendance Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attendance This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{attendanceThisMonth} days</div>
                            {lastCheckIn && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Last check-in: {new Date(lastCheckIn.date).toLocaleDateString()} at {lastCheckIn.check_in_time}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Profile Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="text-sm"><span className="text-muted-foreground">Email:</span> {member.email}</p>
                                <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {member.phone}</p>
                                <p className="text-sm"><span className="text-muted-foreground">Member Since:</span> {new Date(member.join_date).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Payments */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Payments</CardTitle>
                                <CardDescription>Your payment history</CardDescription>
                            </div>
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentPayments.length > 0 ? (
                            <div className="space-y-3">
                                {recentPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{payment.invoice_number}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-semibold">₹{payment.amount}</p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => window.open(`/payments/${payment.id}/invoice`, '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No payment history</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
