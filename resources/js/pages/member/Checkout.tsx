import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';
import { FormEventHandler } from 'react';

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
}

interface Member {
    id: number;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    plan: Plan;
    member: Member;
    amount: number;
    hasActiveSubscription: boolean;
}

export default function Checkout({ plan, member, amount, hasActiveSubscription }: Props) {
    const handlePayment: FormEventHandler = (e) => {
        e.preventDefault();
        window.location.href = `/member/plans/${plan.id}/pay`;
    };

    return (
        <AppSidebarLayout>
            <Head title="Checkout" />

            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Checkout</h1>
                    <p className="text-muted-foreground">Review your order and complete payment</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''} Membership
                                </p>
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Plan Price</span>
                                    <span>₹{plan.price}</span>
                                </div>
                                {!hasActiveSubscription && plan.admission_fee > 0 && (
                                    <div className="flex justify-between">
                                        <span>Admission Fee</span>
                                        <span>₹{plan.admission_fee}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span>₹{amount}</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Member:</strong> {member.user?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Email:</strong> {member.user?.email}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <form onSubmit={handlePayment} className="w-full">
                                <Button type="submit" className="w-full">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay with PhonePe
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
