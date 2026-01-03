import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/types';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface Props {
    stats: {
        total_members: number;
        active_members: number;
        total_subscriptions: number;
        active_subscriptions: number;
        revenue_this_month: number;
    };
    expiring_soon: Subscription[];
    recent_subscriptions: Subscription[];
    revenue_trend: { month: string; revenue: number }[];
    attendance_trend: { date: string; count: number }[];
}

const revenueChartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

const attendanceChartConfig = {
    count: {
        label: "Members",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export default function Dashboard({ stats, expiring_soon, recent_subscriptions, revenue_trend, attendance_trend }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Members"
                        value={stats.total_members}
                        icon={Users}
                        description="All registered members"
                    />
                    <StatsCard
                        title="Active Members"
                        value={stats.active_members}
                        icon={Users}
                        description="Currently active members"
                    />
                    <StatsCard
                        title="Active Subscriptions"
                        value={stats.active_subscriptions}
                        icon={Calendar}
                        description="Valid subscriptions"
                    />
                    <StatsCard
                        title="Revenue This Month"
                        value={`₹${stats.revenue_this_month.toLocaleString()}`}
                        icon={TrendingUp}
                        description="Total monthly revenue"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                            <CardDescription>Last 6 months revenue performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={revenueChartConfig}>
                                <BarChart data={revenue_trend}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis 
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Trend</CardTitle>
                            <CardDescription>Last 7 days attendance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={attendanceChartConfig}>
                                <BarChart data={attendance_trend}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis 
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    <Card>
                        <CardHeader>
                            <CardTitle>Expiring Subscriptions</CardTitle>
                            <CardDescription>Subscriptions expiring in next 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {expiring_soon.length > 0 ? (
                                <div className="space-y-3">
                                    {expiring_soon.map((subscription) => (
                                        <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{subscription.member?.name}</p>
                                                <p className="text-sm text-muted-foreground">{subscription.plan?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{new Date(subscription.end_date).toLocaleDateString()}</p>
                                                <Badge variant="outline" className="mt-1 border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950">Expiring</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No subscriptions expiring soon</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Subscriptions</CardTitle>
                            <CardDescription>Latest member subscriptions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_subscriptions.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_subscriptions.map((subscription) => (
                                        <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{subscription.member?.name}</p>
                                                <p className="text-sm text-muted-foreground">{subscription.plan?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">₹{subscription.total_paid || 0}</p>
                                                <Badge variant="outline" className="mt-1 border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950">{subscription.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No recent subscriptions</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
