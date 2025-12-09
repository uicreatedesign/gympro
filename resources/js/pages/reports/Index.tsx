import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

interface RevenueData {
    date: string;
    total: number;
}

interface MemberGrowth {
    date: string;
    count: number;
}

interface PaymentMethod {
    payment_method: string;
    count: number;
    total: number;
}

interface PopularPlan {
    name: string;
    count: number;
}

interface AttendanceTrend {
    date: string;
    count: number;
}

interface Props extends PageProps {
    revenueData: RevenueData[];
    memberGrowth: MemberGrowth[];
    paymentMethods: PaymentMethod[];
    popularPlans: PopularPlan[];
    attendanceTrends: AttendanceTrend[];
    stats: {
        total_revenue: number;
        new_members: number;
        active_subscriptions: number;
        total_attendance: number;
        avg_daily_attendance: number;
    };
    startDate: string;
    endDate: string;
}

export default function Index({ revenueData, memberGrowth, paymentMethods, popularPlans, attendanceTrends, stats, startDate, endDate }: Props) {
    const [filters, setFilters] = useState({
        start_date: startDate,
        end_date: endDate,
    });

    const handleFilter = () => {
        router.get('/reports', filters);
    };

    const methodLabels: Record<string, string> = {
        cash: 'Cash',
        card: 'Card',
        upi: 'UPI',
        bank_transfer: 'Bank Transfer',
    };

    return (
        <AppLayout>
            <Head title="Reports & Analytics" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                </div>

                {/* Date Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleFilter}>Apply Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.total_revenue}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.new_members}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Daily Attendance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Math.round(stats.avg_daily_attendance)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {revenueData.map((item) => (
                                <div key={item.date} className="flex justify-between items-center">
                                    <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
                                    <span className="font-medium">₹{item.total}</span>
                                </div>
                            ))}
                            {revenueData.length === 0 && (
                                <p className="text-center text-muted-foreground">No revenue data for selected period</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Payment Methods */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div key={method.payment_method} className="flex justify-between items-center">
                                        <span className="text-sm">{methodLabels[method.payment_method]}</span>
                                        <div className="text-right">
                                            <div className="font-medium">₹{method.total}</div>
                                            <div className="text-xs text-muted-foreground">{method.count} transactions</div>
                                        </div>
                                    </div>
                                ))}
                                {paymentMethods.length === 0 && (
                                    <p className="text-center text-muted-foreground">No payment data</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Plans */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {popularPlans.map((plan) => (
                                    <div key={plan.name} className="flex justify-between items-center">
                                        <span className="text-sm">{plan.name}</span>
                                        <span className="font-medium">{plan.count} subscriptions</span>
                                    </div>
                                ))}
                                {popularPlans.length === 0 && (
                                    <p className="text-center text-muted-foreground">No subscription data</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Member Growth */}
                <Card>
                    <CardHeader>
                        <CardTitle>Member Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {memberGrowth.map((item) => (
                                <div key={item.date} className="flex justify-between items-center">
                                    <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
                                    <span className="font-medium">{item.count} new members</span>
                                </div>
                            ))}
                            {memberGrowth.length === 0 && (
                                <p className="text-center text-muted-foreground">No new members in selected period</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {attendanceTrends.map((item) => (
                                <div key={item.date} className="flex justify-between items-center">
                                    <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
                                    <span className="font-medium">{item.count} members</span>
                                </div>
                            ))}
                            {attendanceTrends.length === 0 && (
                                <p className="text-center text-muted-foreground">No attendance data</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
