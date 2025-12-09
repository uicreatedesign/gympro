import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Crown } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    admission_fee: number;
    shift: string;
    shift_time: string;
    personal_training: boolean;
    group_classes: boolean;
    locker_facility: boolean;
    description: string;
    status: string;
}

interface Subscription {
    id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    status: string;
    plan: Plan;
}

interface Member {
    id: number;
    name: string;
}

interface Props {
    plans: Plan[];
    activeSubscription: Subscription | null;
    member: Member;
}

export default function Plans({ plans, activeSubscription, member }: Props) {
    const monthlyPlans = plans.filter(p => p.duration_months <= 3);
    const yearlyPlans = plans.filter(p => p.duration_months > 3);

    const PlanCard = ({ plan }: { plan: Plan }) => {
        const isActive = activeSubscription?.plan_id === plan.id;

        return (
            <Card className={isActive ? 'border-primary shadow-lg' : ''}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {plan.name}
                                {isActive && <Crown className="h-5 w-5 text-primary" />}
                            </CardTitle>
                            <CardDescription>{plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}</CardDescription>
                        </div>
                        {isActive && <Badge>Active</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="text-3xl font-bold">₹{plan.price}</div>
                        {plan.admission_fee > 0 && !activeSubscription && (
                            <div className="text-sm text-muted-foreground">+ ₹{plan.admission_fee} admission fee</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{plan.shift} Shift - {plan.shift_time}</span>
                        </div>
                        {plan.personal_training && (
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Personal Training</span>
                            </div>
                        )}
                        {plan.group_classes && (
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Group Classes</span>
                            </div>
                        )}
                        {plan.locker_facility && (
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Locker Facility</span>
                            </div>
                        )}
                    </div>

                    {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    )}
                </CardContent>
                <CardFooter>
                    {isActive ? (
                        <Button className="w-full" disabled>
                            Current Plan
                        </Button>
                    ) : (
                        <Link href={`/member/checkout/${plan.id}`} className="w-full">
                            <Button className="w-full">
                                Buy Now
                            </Button>
                        </Link>
                    )}
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppSidebarLayout>
            <Head title="Buy Plans" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Membership Plans</h1>
                    <p className="text-muted-foreground">Choose the perfect plan for your fitness journey</p>
                </div>

                {activeSubscription && (
                    <Card className="border-primary bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="h-5 w-5" />
                                Your Active Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{activeSubscription.plan.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Valid until {new Date(activeSubscription.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge variant="outline">Active</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Tabs defaultValue="monthly" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="monthly">Monthly Plans</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly Plans</TabsTrigger>
                    </TabsList>

                    <TabsContent value="monthly" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {monthlyPlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                        {monthlyPlans.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No monthly plans available
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="yearly" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {yearlyPlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                        {yearlyPlans.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No yearly plans available
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppSidebarLayout>
    );
}
