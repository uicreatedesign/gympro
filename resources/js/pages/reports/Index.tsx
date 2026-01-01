import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, TrendingUp, BarChart3, Download } from 'lucide-react';

interface Props {
    revenueStats: any;
    attendanceStats: any;
    memberStats: any;
    subscriptionStats: any;
    planStats: any;
    startDate: string;
    endDate: string;
}

export default function Index({ revenueStats, attendanceStats, memberStats, subscriptionStats, planStats, startDate, endDate }: Props) {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);
    const [activeTab, setActiveTab] = useState('revenue');

    const handleFilter = () => {
        router.get('/reports', { start_date: start, end_date: end }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = `/reports/export?type=${activeTab}&start_date=${start}&end_date=${end}`;
    };

    return (
        <AppLayout>
            <Head title="Reports" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Comprehensive business insights</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label>Start Date</Label>
                                <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <Label>End Date</Label>
                                <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                            </div>
                            <Button onClick={handleFilter}>Apply Filter</Button>
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                        <TabsTrigger value="plans">Plans</TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">₹{Number(revenueStats.total).toFixed(2)}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>By Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {revenueStats.by_method.map((item: any) => (
                                            <div key={item.payment_method} className="flex justify-between items-center">
                                                <span className="capitalize">{item.payment_method}</span>
                                                <Badge variant="outline">₹{Number(item.total).toFixed(2)} ({item.count})</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>By Payment Type</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {revenueStats.by_type.map((item: any) => (
                                            <div key={item.payment_type} className="flex justify-between items-center">
                                                <span className="capitalize">{item.payment_type}</span>
                                                <Badge variant="outline">₹{Number(item.total).toFixed(2)} ({item.count})</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{attendanceStats.total}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Unique Members</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{attendanceStats.unique_members}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{attendanceStats.avg_daily}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.total}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{memberStats.active}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-600">{memberStats.inactive}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Expired</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{memberStats.expired}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">New</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{memberStats.new}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>By Gender</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {memberStats.by_gender.map((item: any) => (
                                        <div key={item.gender} className="flex justify-between items-center">
                                            <span className="capitalize">{item.gender}</span>
                                            <Badge variant="outline">{item.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscriptions" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{subscriptionStats.total}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{subscriptionStats.active}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">{subscriptionStats.pending}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Expired</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{subscriptionStats.expired}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-600">{subscriptionStats.cancelled}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">{subscriptionStats.expiring_soon}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>By Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {subscriptionStats.by_plan.map((item: any) => (
                                        <div key={item.name} className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <Badge variant="outline">{item.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plans" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{planStats.total}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{planStats.active}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Most Popular Plans</CardTitle>
                                <CardDescription>Top 5 plans by subscriptions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {planStats.popular.map((item: any, index: number) => (
                                        <div key={item.name} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{index + 1}</Badge>
                                                <span>{item.name}</span>
                                            </div>
                                            <Badge>{item.count} subscriptions</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
